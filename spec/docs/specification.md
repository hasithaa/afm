---
title: AFM Specification
description: The AFM specification defines a structured, markdown-based format for AI agents, enabling easy sharing, deployment, and understanding across platforms.
hide:
  - navigation
---

## 1. Introduction

AFM (Agent Flavored Markdown) provides a structured, markdown-based format for defining the capabilities, behaviors, and knowledge of AI agents. The goal is to create a universal standard that allows agents to be easily defined, shared, and deployed.

AFM is designed to be composable. It supports not only the definition of individual agents but also complex, multi-agent systems where agents can collaborate and delegate tasks to one another.

This document details the AFM file format, its syntax, and the schema for defining an agent. For a more detailed implementation guide, refer to the [AFM Implementation Guide](#).

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://www.rfc-editor.org/info/bcp14) [[RFC2119](https://datatracker.ietf.org/doc/html/rfc2119)] [[RFC8174](https://datatracker.ietf.org/doc/html/rfc8174)] when, and only when, they appear in all capitals, as shown here.



### 1.1. Key Goals of AFM

- **Human-Readability**: AFM uses a simple, elegant markdown-based syntax that is intuitive for both developers and non-technical stakeholders to read, write, and understand.
- **Interoperability**: AFM provides a standard, unambiguous syntax for agent definition, ensuring that diverse platforms and tools can consistently use the same agent blueprint.

!!! warning "WIP"
    Update this section with more detailed explanations of core concepts as the specification evolves.


## 2. Core Concepts

AFM is built around a few core concepts that define how agents are structured and interact:

* **Agent**: The primary entity defined in AFM, representing an AI agent with specific capabilities and behaviors.
* **Role**: A specific function or set of responsibilities that an agent can perform.
* **Capability**: A specific skill or function that an agent can perform, such as answering questions, performing calculations, or interacting with external systems.

!!! warning "WIP"
    Update this section with more detailed explanations of core concepts as the specification evolves.

## 3. File Format and Content

An agent definition file must use the `*.afm.md` or `.afm` extension. The filename without the extension part serves as the agent's unique artifact ID within its namespace. 
The file name should not start with special characters, numbers, or whitespace. 

The file name **MUST** be unique within the namespace to avoid conflicts.

The file content must be encoded in UTF-8. 

!!! tip "Best Practices for Naming AFM Files"
    When naming your AFM files, follow these best practices are **RECOMMENDED** to ensure clarity and consistency:
    
    - Use lowercase letters, numbers, and hyphens to separate words.
    - Avoid spaces and special characters to ensure compatibility across different systems.

## 4. Syntax Overview

### 4.1. Basic Structure

An AFM file is structured into two main sections: the front matter and the agent declaration.

* **Front Matter**: Contains metadata about the agent.
* **Markdown Body**: Contains the agent's declaration, capabilities, and behaviors. additional information needed for its operation.


### 4.2. Front Matter

The front matter is a YAML block at the top of the file, enclosed by `---` lines. Refer to the [YAML specification](https://yaml.org/spec/1.2/spec.html) for more details on YAML syntax.

This section contains metadata about the agent. These metadata fields are **OPTIONAL** except for the agent identifier which is **REQUIRED** and can be used to provide additional context or configuration for the agent.

| Section             | Description                                                                                   |
|---------------------|-----------------------------------------------------------------------------------------------|
| Agent Metadata      | Information about the agent, such as its name, description, version, and author.              |
| Agent Interface     | Defines how the agent is invoked and its input/output signature.                             |
| Agent Capabilities  | A list of capabilities (tools, skills, or functions) that the agent can perform.              |
| Connections         | Defines outbound connections to external tools and peer agents.                              |

Refer to the [AFM Schema](#5-schema-definitions) for a complete list of fields and their meanings.

!!! warning "WIP"
    Update this section with more detailed explanations of front matter fields as the specification evolves.


### 4.3.  Markdown Body

This section contains the detailed, natural language instructions that guide the agent's behavior. Use headings (`#`, `##`, etc.) to structure the prompt.
Users can use markdown syntax to format the text, including lists, links, and code blocks.

The Markdown body **SHOULD** contain the following headings, with corresponding content

 - `# Role`: A brief description of the agent's role.
 - `# Capabilities` **OR** `# Instructions`: A list of the agent's capabilities or instructions.


### 4.4. Example

!!! example "Basic AFM File Example"
    Here is a simple example of an AFM file:

    ```yaml
    ---
    name: "Math Tutor"
    description: "An AI assistant that helps with mathematics problems"
    version: "1.0.0"
    namespace: "education"
    authors:
      - "Jane Smith <jane@example.com>"
    license: "MIT"
    
    interface:
      type: function
      signature:
        input:
          - name: user_prompt
            type: string
            description: "The student's math question or problem"
            required: true
          - name: difficulty_level
            type: string
            description: "Beginner, intermediate, or advanced"
            required: false
        output:
          - name: solution
            type: string
            description: "Step-by-step solution to the problem"
          - name: explanation
            type: string
            description: "Educational explanation of concepts used"
    ---

    # Role
    The Math Tutor is an AI agent designed to assist students with mathematics problems, providing explanations, step-by-step solutions, and practice exercises.

    # Capabilities

    This agent should be able to:

    - Answer questions about mathematical concepts
    - Solve equations and provide step-by-step solutions
    - Generate practice problems and quizzes
    - Provide explanations and tips for solving math problems
  
     ## Instructions
    - Use clear and concise language when explaining concepts.
    - Provide examples to illustrate complex ideas.
    - Encourage students to think critically and solve problems independently.
    ```

## 5. Schema Definitions

This section defines the schema for the Front Matter. For clarity, the schema is divided into several subsections, each detailing a specific aspect of the Agent.

### 5.1. About the Agent 

This section defines the schema for agent-specific metadata. It is **OPTIONAL** but recommended for clarity and organization, except for the agent identifier which is **REQUIRED**. AFM implementations **SHALL** use this section to display the agent's metadata in user interfaces to provide better user experience for end users.

#### 5.1.1. Schema Overview

The agent metadata fields are specified in the YAML frontmatter of an AFM file:

```yaml
# Agent metadata schema
name: string           # The name of the agent
description: string    # Brief description of the agent's purpose and functionality
version: string        # Semantic version (e.g., "1.0.0")
namespace: string      # Logical grouping category for the agent
author: string         # Single author in format "Name <Email>"
authors:               # Takes precedence over author field if both exist
  - string             # Multiple authors, each in format "Name <Email>"
provider: object       # Agent provider
  organization: string # Name of the organization
  url: string          # URL to the organization's website
iconUrl: string        # URL to an icon representing the agent
license: string        # License under which the agent is released
```

#### 5.1.2. Field Definitions {#agent-field-definitions}

Each field serves a specific purpose in defining and organizing the agent:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| [`name`](#field-name) | `string` | No | Identifies the agent in human-readable form.<br>Default: inferred from the filename of the AFM file.<br>AFM implementations **SHALL** use this field to display the agent's name in user interfaces. |
| [`description`](#field-description) | `string` | No | Provides a concise summary of what the agent does.<br>Default: inferred from the markdown body `# Role` section.<br>AFM implementations **SHALL** use this field to display the agent's description in user interfaces. |
| [`version`](#field-version) | `string` | No | [Semantic version](https://semver.org/) of the agent definition (MAJOR.MINOR.PATCH).<br>Default: "0.0.0".<br>AFM implementations **SHALL** use this field to display the agent's version in user interfaces. |
| [`namespace`](#field-namespace) | `string` | No | Logical grouping category for the agent.<br>Default: "default".<br>AFM implementations **SHALL** use this field to organize agents into logical groups or categories. |
| [`author`](#field-author) | `string` | No | Single author in format "Name <Email>".<br>Credits the creator of the agent definition. If both `author` and `authors` fields are provided, `authors` takes precedence. |
| [`authors`](#field-authors) | `string[]` | No | Multiple authors, each in format "Name <Email>".<br>Credits the creators of the agent definition. Takes precedence over `author` if both exist. |
| [`iconUrl`](#field-iconurl) | `string` | No | URL to an icon representing the agent.<br>This is **OPTIONAL** but recommended for visual representation in user interfaces.<br>AFM implementations **SHALL** use this field to display the agent's icon in user interfaces. |
| [`provider`](#field-provider) | `object` | No | Information about the organization providing the agent.<br>This is **OPTIONAL** but recommended for attribution.<br>See the [Provider Object](#provider-object) below for details. |
| [`license`](#field-license) | `string` | No | License under which the agent definition is released.<br>This is **OPTIONAL** but recommended for clarity. |

**<a id="provider-object"></a>Provider Object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| [`provider.organization`](#field-provider-organization) | `string` | No | Name of the organization providing the agent. |
| [`provider.url`](#field-provider-url) | `string` | No | URL to the organization's website. |

#### 5.1.3. Example Usage

Here's an example of agent metadata in an AFM file:

```yaml
---
name: "Math Tutor"
description: "An AI assistant that helps with mathematics problems"
version: "1.2.0"
namespace: "education"
authors:
  - "Jane Smith <jane@example.com>"
  - "John Doe <john@example.com>"
provider:
    organization: "Example AI Solutions"
    url: "https://example.com"
iconUrl: 
license: "MIT"
---
```

### 5.2. Agent Interface

This section defines the agent's public "API" or "function signature." It is **REQUIRED** and specifies how the agent receives inputs and produces outputs.

#### 5.2.1. Schema Overview

```yaml
interface:
  type: string           # The invocation style: 'service' or 'function'.
  signature:
    input: [object]      # A list of input parameter objects.
    output: [object]     # A list of output parameter objects.
  exposure:              # Optional, for 'service' type agents.
    http: object         # Configuration for exposing as an HTTP endpoint.
    a2a: object          # Configuration for exposing as an A2A-compliant service.
```

#### 5.2.2. Field Definitions

| Field         | Type     | Required | Description                                                                                             |
|---------------|----------|----------|---------------------------------------------------------------------------------------------------------|
| `type`        | `string` | Yes      | The agent's invocation style. Must be one of:<br>- `service`: A network-accessible agent.<br>- `function`: An agent callable within an application. |
| `signature`   | `object` | Yes      | Defines the agent's input and output parameters. See [Signature Object](#signature-object).                  |
| `exposure`    | `object` | No       | Configuration for how a `service` agent is exposed. See [Exposure Object](#exposure-object).                |

<a id="signature-object"></a>
**Signature Object:**

Defines the data contract for the agent.

| Field    | Type    | Required | Description                                                                                                |
|----------|---------|----------|------------------------------------------------------------------------------------------------------------|
| `input`  | `array` | Yes      | An array of objects, each defining a named input parameter. The dynamic "user prompt" should be defined here. |
| `output` | `array` | Yes      | An array of objects, each defining a named output parameter.                                                      |

Each `input` or `output` object has the following structure:

| Key           | Type      | Description                                     |
|---------------|-----------|-------------------------------------------------|
| `name`        | `string`  | The name of the parameter (e.g., `user_prompt`). |
| `type`        | `string`  | The data type (e.g., `string`, `json`, `file`).  |
| `description` | `string`  | A brief explanation of the parameter.           |
| `required`    | `boolean` | (For `input` only) Whether the parameter is mandatory. |

<a id="exposure-object"></a>
**Exposure Object:**

Contains configurations for `service` agents.

| Field  | Type     | Required | Description                                                          |
|--------|----------|----------|----------------------------------------------------------------------|
| `http` | `object` | No | Defines how to expose the agent via a standard HTTP endpoint.        |
| `a2a`  | `object` | No | Defines how the agent is exposed and discovered within an A2A network. See [Section 6.3](#63-agent-card-schema) for Agent Card details. |

#### 5.2.3. Example Usage

Here's an example of an agent interface definition:

```yaml
interface:
  type: service
  signature:
    input:
      - name: user_prompt
        type: string
        description: "The user's query or request"
        required: true
      - name: context
        type: json
        description: "Additional context for the request"
        required: false
    output:
      - name: response
        type: string
        description: "The agent's response to the user prompt"
      - name: confidence
        type: number
        description: "Confidence score for the response"
  exposure:
    a2a:
      discoverable: true
      agent_card:
        name: "Research Assistant"
        description: "Expert in finding, analyzing, and summarizing research papers"
        icon: "https://example.com/icons/research-assistant.png"
```

### 5.3. Connections

This section defines the schema for an agent's **outbound connections** to external tools and other agents. It enables agents to consume external resources.

#### 5.3.1. Schema Overview

The connections fields are specified in the YAML frontmatter of an AFM file:

```yaml
connections:
  mcp: object         # Configuration for connecting to MCP tools.
  a2a: object         # Configuration for connecting to Peer Agents.
```

#### 5.3.2. Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `connections` | `object` | No | Container for protocol-specific connection configurations. |
| `connections.mcp` | `object` | No | Configuration for Model Context Protocol. See [Section 6.1](#61-model-context-protocol-mcp) for details. |
| `connections.a2a` | `object` | No | Configuration for Agent-to-Agent Protocol. See [Section 6.2](#62-agent-to-agent-protocol-a2a) for details. |

**MCP Connection Object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `servers` | `array` | Yes | List of MCP servers to connect to. See [Section 6.1](#61-model-context-protocol-mcp) for detailed schema. |
| `tool_filter` | `object` | No | Filter configuration for tools. See [Section 6.1](#61-model-context-protocol-mcp) for details. |

**A2A Connection Object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `peers` | `array` | No | List of peer agents to connect to. See [Section 6.2](#62-agent-to-agent-protocol-a2a) for detailed schema. |

#### 5.3.3. Example Usage

Here's a simple example of connections in an AFM file:

```yaml
connections:
  mcp:
    servers:
      - name: "github_api"
        transport:
          type: "http_sse"
          url: "https://mcp.github.com/api"
  a2a:
    peers:
      - name: "research_assistant"
        endpoint: "https://agents.example.com/research-assistant"
```

### 5.4. Agent Capabilities

This section defines the schema for agent capabilities - the tools, skills, or functions that the agent can perform.

## 6. Protocol Extensions

This section provides detailed specifications for the protocols referenced in the [Connections section](#53-connections). These protocols enable agents to communicate with external systems and other agents.

### 6.1. Model Context Protocol (MCP)

The Model Context Protocol (MCP) enables agents to connect to external tools and data sources.

#### 6.1.1. Schema Overview

```yaml
mcp:
  servers:
    - name: string           # Unique identifier for the server connection
      transport:
        type: string         # Transport mechanism (http_sse, stdio, streamable_http)
        url: string          # URL endpoint (for http_sse and streamable_http)
        command: string      # Shell command (for stdio)
      authentication:        # Optional
        type: string         # Authentication scheme (oauth2, api_key, etc.)
  tool_filter:               # Optional
    allow: [string]          # Whitelist of tools in "server_name/tool_name" format
    deny: [string]           # Blacklist of tools in "server_name/tool_name" format
```

#### 6.1.2. Field Definitions

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `servers` | Array | Yes | Specifies the MCP servers that the agent can connect to. Each server entry must have a unique `name` that identifies the connection. |
| `tool_filter` | Object | No | Allows for fine-grained control over which tools from the connected servers are exposed to the agent. |

**Server Object:**

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `name` | String | Yes | A unique, human-readable identifier for the connection. |
| `transport` | Object | Yes | An object defining the communication mechanism. See [Transport Object](#transport-object) below. |
| `authentication` | Object | No | An object declaring the required authentication scheme. See [Authentication Object](#authentication-object) below. |

**<a id="transport-object"></a>Transport Object:**

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `type` | String | Yes | Transport mechanism, which must be one of:<br>- `http_sse`: Server-Sent Events over HTTP<br>- `stdio`: Standard input/output for local processes<br>- `streamable_http`: HTTP with streaming capabilities |
| `url` | String | For HTTP types | The URL endpoint of the remote MCP server. |
| `command` | String | For stdio | The shell command used to start the local MCP server process. |

**<a id="authentication-object"></a>Authentication Object:**

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `type` | String | Yes | Authentication scheme (e.g., `oauth2`, `api_key`).<br>The agent's host environment is responsible for managing the actual credentials and authentication flow. |

**Tool Filter Object:**

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `allow` | String Array | No | A whitelist of tools to expose, in `server_name/tool_name` format. |
| `deny` | String Array | No | A blacklist of tools to hide, in `server_name/tool_name` format. |

#### 6.1.3. Example Implementation

This example defines connections to a remote GitHub MCP server (requiring OAuth 2.0) and a local filesystem server. It then filters the available tools.

```yaml
connections:
  mcp:
    servers:
      - name: github_mcp_server
        transport:
          type: http_sse
          url: "https://mcp.github.com/api"
        authentication:
          type: oauth2

      - name: local_filesystem_server
        transport:
          type: stdio
          command: "npx -y @modelcontextprotocol/server-filesystem"

    tool_filter:
      allow:
        - "github_mcp_server/create_issue"
        - "github_mcp_server/list_repositories"
        - "local_filesystem_server/read_file"
      deny:
        - "local_filesystem_server/write_file"
```

### 6.2. Agent-to-Agent Protocol (A2A)

The Agent-to-Agent Protocol (A2A) enables agents to collaborate with other agents, forming a multi-agent system where tasks can be delegated and information can be shared.

#### 6.2.1. Schema Overview

```yaml
connections:
  a2a:
    peers:
      - name: string      # A local alias for the peer agent.
        endpoint: string  # The network address of the peer agent.
        # Future fields could include discovery mechanisms, etc.
```

#### 6.2.2. Field Definitions

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `peers` | Array | No | List of peer agents that this agent can connect to and call. |

**Peer Object:**

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `name` | String | Yes | A local alias for the peer agent, used to reference it within this agent's logic. |
| `endpoint` | String | Yes | The network address or URL where the peer agent service is accessible. |

#### 6.2.3. Example Implementation

```yaml
connections:
  a2a:
    peers:
      - name: "research_assistant"
        endpoint: "https://agents.example.com/research-assistant"
      - name: "data_analyzer"
        endpoint: "https://internal.company.com/agents/data-analyzer"
```

### 6.3. Agent Card Schema

The Agent Card provides metadata for service discovery and display when agents expose themselves as services through the A2A protocol.

#### 6.3.1. Schema Overview

```yaml
interface:
  exposure:
    a2a:
      discoverable: boolean  # Whether the agent should be discoverable by other agents
      agent_card:            # Optional metadata for agent discovery
        name: string         # Display name for the agent in service directories
        description: string  # Brief description of the agent's service capabilities
        icon: string         # URL to an icon representing the agent service
```

#### 6.3.2. Field Definitions

**A2A Exposure Object:**

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `discoverable` | Boolean | No | Controls whether the agent is listed in service directories for other agents to find. Default: `true` when exposing as a service. |
| `agent_card` | Object | No | Contains metadata used when the agent is listed in service directories. See [Agent Card Object](#agent-card-object) below. |

**<a id="agent-card-object"></a>Agent Card Object:**

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `name` | String | No | Display name for the agent in service directories. Default: Uses the agent's name from its metadata. |
| `description` | String | No | Brief description of what services the agent provides. Default: Uses the agent's description from its metadata. |
| `icon` | String | No | URL to an icon representing the agent service. Default: Uses the agent's iconUrl from its metadata. |

#### 6.3.3. Example Implementation

This example defines an agent that exposes itself as a discoverable service with custom agent card information:

```yaml
interface:
  type: service
  exposure:
    a2a:
      discoverable: true
      agent_card:
        name: "Research Assistant"
        description: "Expert in finding, analyzing, and summarizing research papers"
        icon: "https://example.com/icons/research-assistant.png"
```
