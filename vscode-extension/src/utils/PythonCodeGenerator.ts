import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { AfmDocument } from './types';

export class PythonCodeGenerator {
    
    /**
     * Generate Python agent code from AFM document
     */
    public static async generatePythonAgent(document: AfmDocument, workspaceRoot: string, uri: vscode.Uri): Promise<string> {
        const agentId = this.getAgentId(document, uri);
        const targetDir = path.join(workspaceRoot, 'target', agentId, 'python3');
        
        console.log('PythonCodeGenerator: Generating Python agent in:', targetDir);
        
        // Create target directory
        await this.ensureDirectoryExists(targetDir);
        
        // Generate files
        await this.generateConfigToml(targetDir, document);
        await this.generateMainPy(targetDir, document);
        await this.generateAgentPy(targetDir, document);
        await this.generateRequirementsTxt(targetDir);
        await this.generateReadmeMd(targetDir, document);
        
        console.log('PythonCodeGenerator: Successfully generated Python agent');
        return targetDir;
    }
    
    /**
     * Get agent ID for directory naming
     */
    private static getAgentId(document: AfmDocument, uri: vscode.Uri): string {
        // Use namespace and name if available, otherwise derive from filename
        const namespace = document.metadata?.namespace || 'default';
        const name = document.metadata?.name || path.basename(uri.fsPath, path.extname(uri.fsPath));
        
        // Clean up the name for directory usage
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const cleanNamespace = namespace.toLowerCase().replace(/[^a-z0-9]/g, '_');
        
        return `${cleanNamespace}_${cleanName}`;
    }
    
    /**
     * Ensure directory exists
     */
    private static async ensureDirectoryExists(dirPath: string): Promise<void> {
        try {
            console.log('PythonCodeGenerator: Creating directory:', dirPath);
            const dirUri = vscode.Uri.file(dirPath);
            await vscode.workspace.fs.createDirectory(dirUri);
            console.log('PythonCodeGenerator: Directory created successfully');
        } catch (error) {
            console.error('PythonCodeGenerator: Error creating directory:', error);
            throw error;
        }
    }
    
    /**
     * Generate Config.toml file
     */
    private static async generateConfigToml(targetDir: string, document: AfmDocument): Promise<void> {
        const configContent = `[llm]
provider = "openai"
model = "gpt-4"
api_key_env = "OPENAI_API_KEY"
temperature = 0.7
max_tokens = 1000

[agent]
name = "${document.metadata?.name || 'AFM Agent'}"
description = "${document.metadata?.description || 'Generated from AFM document'}"
version = "${document.metadata?.version || '1.0.0'}"
namespace = "${document.metadata?.namespace || 'default'}"
${document.metadata?.author ? `author = "${document.metadata.author}"` : ''}
${document.metadata?.license ? `license = "${document.metadata.license}"` : ''}

[logging]
level = "INFO"
format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
`;
        
        const configPath = path.join(targetDir, 'Config.toml');
        const configUri = vscode.Uri.file(configPath);
        console.log('PythonCodeGenerator: Writing Config.toml to:', configPath);
        await vscode.workspace.fs.writeFile(configUri, Buffer.from(configContent, 'utf8'));
    }
    
    /**
     * Generate main.py file
     */
    private static async generateMainPy(targetDir: string, document: AfmDocument): Promise<void> {
        const mainContent = `#!/usr/bin/env python3
"""
${document.metadata?.name || 'AFM Agent'} - Main Entry Point
${document.metadata?.description || 'Generated from AFM document'}

Author: ${document.metadata?.author || 'AFM Generator'}
Version: ${document.metadata?.version || '1.0.0'}
"""

import sys
import logging
from pathlib import Path
import toml

from agent import Agent


def load_config():
    """Load configuration from Config.toml"""
    config_path = Path(__file__).parent / "Config.toml"
    if not config_path.exists():
        raise FileNotFoundError(f"Configuration file not found: {config_path}")
    
    return toml.load(config_path)


def setup_logging(config):
    """Setup logging configuration"""
    log_config = config.get('logging', {})
    level = getattr(logging, log_config.get('level', 'INFO'))
    format_str = log_config.get('format', '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    
    logging.basicConfig(level=level, format=format_str)
    return logging.getLogger(__name__)


def main():
    """Main function"""
    try:
        # Load configuration
        config = load_config()
        logger = setup_logging(config)
        
        logger.info("Starting ${document.metadata?.name || 'AFM Agent'}")
        
        # Create agent
        agent = Agent(config)
        
        # Check if message provided as command line argument
        if len(sys.argv) > 1:
            # Single message mode
            message = " ".join(sys.argv[1:])
            response = agent.process_query(message)
            print(response)
        else:
            # Interactive mode
            agent.run()
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
`;
        
        const mainPath = path.join(targetDir, 'main.py');
        const mainUri = vscode.Uri.file(mainPath);
        console.log('PythonCodeGenerator: Writing main.py to:', mainPath);
        await vscode.workspace.fs.writeFile(mainUri, Buffer.from(mainContent, 'utf8'));
    }
    
    /**
     * Generate agent.py file with the actual agent logic
     */
    private static async generateAgentPy(targetDir: string, document: AfmDocument): Promise<void> {
        const agentContent = `"""
${document.metadata?.name || 'AFM Agent'} Implementation
${document.metadata?.description || 'Generated from AFM document'}
"""

import logging
import os
import sys
from typing import Dict, Any, Optional

try:
    from openai import OpenAI
except ImportError:
    print("Error: OpenAI library not found. Please install it with: pip3 install openai>=1.0.0")
    sys.exit(1)


class Agent:
    """Main agent class"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger(self.__class__.__name__)
        
        # Setup OpenAI
        self.setup_llm()
        
        # Agent metadata
        self.name = config.get('agent', {}).get('name', '${document.metadata?.name || 'AFM Agent'}')
        self.description = config.get('agent', {}).get('description', '${document.metadata?.description || 'Generated agent'}')
        self.version = config.get('agent', {}).get('version', '${document.metadata?.version || '1.0.0'}')
        
        self.logger.info(f"Initialized agent: {self.name} v{self.version}")
    
    def setup_llm(self):
        """Setup LLM configuration"""
        llm_config = self.config.get('llm', {})
        
        # Set OpenAI API key from environment variable
        api_key_env = llm_config.get('api_key_env', 'OPENAI_API_KEY')
        api_key = os.getenv(api_key_env)
        
        if not api_key:
            raise ValueError(f"OpenAI API key not found in environment variable: {api_key_env}")
        
        try:
            # Initialize OpenAI client (v1.0+ API)
            self.client = OpenAI(api_key=api_key)
        except Exception as e:
            self.logger.error(f"Failed to initialize OpenAI client: {e}")
            raise
        
        self.model = llm_config.get('model', 'gpt-4')
        self.temperature = llm_config.get('temperature', 0.7)
        self.max_tokens = llm_config.get('max_tokens', 1000)
        
        self.logger.info(f"LLM configured: model={self.model}, temperature={self.temperature}")
    
    def call_llm(self, prompt: str, system_message: Optional[str] = None) -> str:
        """Call the LLM with a prompt"""
        messages = []
        
        if system_message:
            messages.append({"role": "system", "content": system_message})
        
        messages.append({"role": "user", "content": prompt})
        
        try:
            # Use the new OpenAI v1.0+ API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            # Extract content safely to avoid pydantic validation issues
            if hasattr(response, 'choices') and len(response.choices) > 0:
                choice = response.choices[0]
                if hasattr(choice, 'message') and hasattr(choice.message, 'content'):
                    content = choice.message.content
                    return content.strip() if content else "Sorry, I didn't receive a response."
            
            return "Sorry, I received an unexpected response format."
            
        except Exception as e:
            error_msg = str(e)
            self.logger.error(f"LLM call failed: {error_msg}")
            
            # Handle specific error types
            if "pydantic" in error_msg.lower():
                return "Sorry, there was a response formatting issue. Please try again."
            elif "api_key" in error_msg.lower():
                return "Sorry, there was an API key issue. Please check your OpenAI API key."
            elif "rate_limit" in error_msg.lower():
                return "Sorry, rate limit exceeded. Please wait a moment and try again."
            else:
                return f"Sorry, I encountered an error: {error_msg}"
    
    def process_query(self, query: str) -> str:
        """Process a user query using the AFM content"""
        system_message = f"""You are {self.name}, {self.description}

Agent Instructions:
${document.content || 'No specific instructions provided.'}

Please respond to user queries based on these instructions."""
        
        try:
            response = self.call_llm(query, system_message)
            self.logger.info(f"Processed query: {query[:50]}...")
            return response
            
        except Exception as e:
            self.logger.error(f"Error processing query: {e}")
            return f"Sorry, I encountered an unexpected error: {e}"
    
    def run(self):
        """Run the agent in interactive mode"""
        print(f"\\n🤖 {self.name} v{self.version}")
        print(f"📝 {self.description}")
        print("\\nType 'quit' or 'exit' to stop, 'help' for commands\\n")
        
        while True:
            try:
                user_input = input("You: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'q']:
                    print("👋 Goodbye!")
                    break
                
                if user_input.lower() == 'help':
                    self.show_help()
                    continue
                
                if not user_input:
                    continue
                
                print("🤖 Agent: ", end="", flush=True)
                response = self.process_query(user_input)
                print(response)
                print()
                
            except KeyboardInterrupt:
                print("\\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
                self.logger.error(f"Runtime error: {e}")
    
    def show_help(self):
        """Show help information"""
        print(f"""
🤖 {self.name} Help
{'=' * (len(self.name) + 10)}

Commands:
  help     - Show this help message
  quit/exit/q - Exit the agent

About:
  Name: {self.name}
  Version: {self.version}
  Description: {self.description}

Just type your questions or requests, and I'll respond based on my instructions.
        """)
`;
        
        const agentPath = path.join(targetDir, 'agent.py');
        const agentUri = vscode.Uri.file(agentPath);
        console.log('PythonCodeGenerator: Writing agent.py to:', agentPath);
        await vscode.workspace.fs.writeFile(agentUri, Buffer.from(agentContent, 'utf8'));
    }
    
    /**
     * Generate requirements.txt file
     */
    private static async generateRequirementsTxt(targetDir: string): Promise<void> {
        const requirementsContent = `openai>=1.0.0,<2.0.0
toml>=0.10.2
pydantic>=2.0.0
`;
        
        const requirementsPath = path.join(targetDir, 'requirements.txt');
        const requirementsUri = vscode.Uri.file(requirementsPath);
        console.log('PythonCodeGenerator: Writing requirements.txt to:', requirementsPath);
        await vscode.workspace.fs.writeFile(requirementsUri, Buffer.from(requirementsContent, 'utf8'));
    }
    
    /**
     * Generate README.md file
     */
    private static async generateReadmeMd(targetDir: string, document: AfmDocument): Promise<void> {
        const readmeContent = `# ${document.metadata?.name || 'AFM Agent'}

${document.metadata?.description || 'Generated from AFM document'}

## Generated Information

- **Version**: ${document.metadata?.version || '1.0.0'}
- **Namespace**: ${document.metadata?.namespace || 'default'}
${document.metadata?.author ? `- **Author**: ${document.metadata.author}` : ''}
${document.metadata?.license ? `- **License**: ${document.metadata.license}` : ''}

## Setup

1. Install dependencies:
   \`\`\`bash
   pip3 install -r requirements.txt
   \`\`\`

2. If you encounter Pydantic validation errors, try upgrading:
   \`\`\`bash
   pip3 install --upgrade openai pydantic
   \`\`\`

3. Set up your OpenAI API key:
   \`\`\`bash
   export OPENAI_API_KEY="your-api-key-here"
   \`\`\`

4. Optionally, modify \`Config.toml\` to customize the agent behavior.

## Usage

Run the agent:
\`\`\`bash
python3 main.py
\`\`\`

## Troubleshooting

- **Pydantic errors**: Make sure you have compatible versions with \`pip3 install --upgrade openai pydantic\`
- **API key errors**: Ensure your OpenAI API key is set correctly
- **Import errors**: Reinstall dependencies with \`pip3 install -r requirements.txt\`

The agent will start in interactive mode. Type your questions and the agent will respond based on the AFM instructions.

## Configuration

Edit \`Config.toml\` to modify:
- LLM provider and model settings (compatible with OpenAI v1.0+)
- Agent metadata
- Logging configuration

## Dependencies

This agent uses the modern OpenAI Python library (v1.0+):
- \`openai>=1.0.0\` - Modern OpenAI API client
- \`toml>=0.10.2\` - Configuration file parsing

## Generated from AFM

This Python agent was automatically generated from an AFM (Agent Flow Markup) document. The original agent instructions have been embedded in the agent's system message.

${document.content ? '## Original AFM Content\n\n' + document.content : ''}
`;
        
        const readmePath = path.join(targetDir, 'README.md');
        const readmeUri = vscode.Uri.file(readmePath);
        console.log('PythonCodeGenerator: Writing README.md to:', readmePath);
        await vscode.workspace.fs.writeFile(readmeUri, Buffer.from(readmeContent, 'utf8'));
    }
}