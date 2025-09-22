import * as vscode from 'vscode';
import * as path from 'path';
import { AfmDocument } from './types';

export class BallerinaCodeGenerator {
    
    /**
     * Generate Ballerina agent code from AFM document
     */
    public static async generateBallerinaAgent(document: AfmDocument, workspaceRoot: string, uri: vscode.Uri): Promise<string> {
        const agentId = this.getAgentId(document, uri);
        const targetDir = path.join(workspaceRoot, 'target', agentId, 'ballerina');
        
        console.log('BallerinaCodeGenerator: Generating Ballerina agent in:', targetDir);
        
        // Create target directory
        await this.ensureDirectoryExists(targetDir);
        
        // Generate files
        await this.generateBallerinaToml(targetDir, document);
        await this.generateMainBal(targetDir, document);
        await this.generateConfigToml(targetDir, document);
        await this.generateReadmeMd(targetDir, document);
        
        console.log('BallerinaCodeGenerator: Successfully generated Ballerina agent');
        return targetDir;
    }
    
    /**
     * Get agent ID for directory naming
     */
    private static getAgentId(document: AfmDocument, uri: vscode.Uri): string {
        const namespace = document.metadata?.namespace || 'default';
        const name = document.metadata?.name || path.basename(uri.fsPath, path.extname(uri.fsPath));
        
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const cleanNamespace = namespace.toLowerCase().replace(/[^a-z0-9]/g, '_');
        
        return `${cleanNamespace}_${cleanName}`;
    }
    
    /**
     * Ensure directory exists
     */
    private static async ensureDirectoryExists(dirPath: string): Promise<void> {
        try {
            console.log('BallerinaCodeGenerator: Creating directory:', dirPath);
            const dirUri = vscode.Uri.file(dirPath);
            await vscode.workspace.fs.createDirectory(dirUri);
            console.log('BallerinaCodeGenerator: Directory created successfully');
        } catch (error) {
            console.error('BallerinaCodeGenerator: Error creating directory:', error);
            throw error;
        }
    }
    
    /**
     * Generate Ballerina.toml file
     */
    private static async generateBallerinaToml(targetDir: string, document: AfmDocument): Promise<void> {
        const namespace = document.metadata?.namespace || 'default';
        const name = document.metadata?.name || 'afm_agent';
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        
        const content = `[package]
org="${namespace.toUpperCase()}"
name = "${cleanName}"
version = "${document.metadata?.version || '1.0.1'}"
distribution = "2201.12.9"

[build-options]
observabilityIncluded = true
`;
        
        const filePath = path.join(targetDir, 'Ballerina.toml');
        const fileUri = vscode.Uri.file(filePath);
        console.log('BallerinaCodeGenerator: Writing Ballerina.toml to:', filePath);
        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));
    }
    
    /**
     * Generate main.bal file
     */
    private static async generateMainBal(targetDir: string, document: AfmDocument): Promise<void> {
        const agentName = document.metadata?.name || 'AFM Agent';
        const agentInstructions = document.content || 'You are a helpful AI assistant.';
        
        const content = `import ballerina/ai;
import ballerina/io;

// Default AI model provider (uses WSO2 model provider)
final ai:Wso2ModelProvider _aiModel = check ai:getDefaultModelProvider();

// Or configure specific models (uncomment and configure as needed)
// configurable string serviceUrl = ?;
// configurable string apiKey = ?;
// configurable string deploymentId = ?;
// configurable string apiVersion = ?;
// final ai:ModelProvider azureOpenAIModel = check new azure:OpenAiModelProvider(
//                                         serviceUrl, apiKey, deploymentId, apiVersion);

// Agent configuration
final ai:Agent afmAgent = check new (
    systemPrompt = {
        role: "${agentName}", 
        instructions: string \`${agentInstructions}\`
    }, 
    model = _aiModel, 
    tools = []
);

// Main function to run the agent
public function main(string message) returns error? {
    
    // Single message mode
    string result = check afmAgent.run(message);
    io:println(result);
}
`;
        
        const filePath = path.join(targetDir, 'main.bal');
        const fileUri = vscode.Uri.file(filePath);
        console.log('BallerinaCodeGenerator: Writing main.bal to:', filePath);
        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));
    }
    
    /**
     * Generate Config.toml file
     */
    private static async generateConfigToml(targetDir: string, document: AfmDocument): Promise<void> {
        const content = `# Configuration for ${document.metadata?.name || 'AFM Agent'}
# This file is optional when using the default AI model provider

# Uncomment and configure if using specific AI models:
# serviceUrl = "your-service-url"
# apiKey = "your-api-key"
# deploymentId = "your-deployment-id"
# apiVersion = "your-api-version"
`;
        
        const filePath = path.join(targetDir, 'Config.toml');
        const fileUri = vscode.Uri.file(filePath);
        console.log('BallerinaCodeGenerator: Writing Config.toml to:', filePath);
        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));
    }
    
    /**
     * Generate README.md file
     */
    private static async generateReadmeMd(targetDir: string, document: AfmDocument): Promise<void> {
        const content = `# ${document.metadata?.name || 'AFM Agent'} (Ballerina)

${document.metadata?.description || 'Generated from AFM document'}

## Generated Information

- **Version**: ${document.metadata?.version || '1.0.1'}
- **Namespace**: ${document.metadata?.namespace || 'default'}
- **Language**: Ballerina (using AI library)
${document.metadata?.author ? `- **Author**: ${document.metadata.author}` : ''}
${document.metadata?.license ? `- **License**: ${document.metadata.license}` : ''}

## Prerequisites

1. Install Ballerina: https://ballerina.io/downloads/
2. Ensure you have Ballerina 2201.12.9 or later with AI library support

## Setup

This agent uses Ballerina's built-in AI library with the default WSO2 model provider. No additional configuration is required to get started.

### For Custom AI Models (Optional)

If you want to use specific AI models (like Azure OpenAI), uncomment and configure the relevant sections in \`main.bal\`.

## Usage

The agent accepts a single message as a command line argument:

\`\`\`bash
bal run -- "Your question or request here"
\`\`\`

### Examples

\`\`\`bash
# Ask a question
bal run -- "What can you help me with?"

# Request assistance
bal run -- "Explain quantum computing in simple terms"

# Get help with a specific topic
bal run -- "Help me solve 2x + 5 = 13"
\`\`\`

## Build and Run

\`\`\`bash
# Build the project
bal build

# Run with a message
bal run -- "Your message here"
\`\`\`

## Features

- Single message processing via command line
- Built-in error handling
- Uses Ballerina AI library for model abstraction
- AFM instructions embedded as system prompt
- Simple, clean interface

## Configuration

The agent uses the default WSO2 AI model provider. To use custom models:

1. Uncomment the model configuration section in \`main.bal\`
2. Set the configurable variables for your AI service
3. Replace \`_aiModel\` with your custom model provider

## Generated from AFM

This Ballerina agent was automatically generated from an AFM (Agent Flow Markup) document. The original agent instructions are embedded as the system prompt in the AI agent configuration.

### AFM Instructions
\`\`\`
${document.content || 'No specific instructions provided.'}
\`\`\`
`;
        
        const filePath = path.join(targetDir, 'README.md');
        const fileUri = vscode.Uri.file(filePath);
        console.log('BallerinaCodeGenerator: Writing README.md to:', filePath);
        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));
    }
}