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
| Agent Interface     | Defines how the agent interacts with other agents or systems, including input and output formats. |
| Agent Capabilities  | A list of capabilities (tools, skills, or functions) that the agent can perform.              |

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

#### 5.1.2. Field Definitions

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | `string` | No | filename | Name of the agent. If not provided, inferred from the filename. |
| `description` | `string` | No | from Role section | Brief description of the agent's purpose. If not provided, inferred from the `# Role` section. |
| `version` | `string` | No | "0.0.0" | [Semantic version](https://semver.org/) of the agent definition. |
| `namespace` | `string` | No | "default" | Logical grouping category for the agent. |
| `author` | `string` | No | - | Single author in format "Name <Email>". |
| `authors` | `string[]` | No | - | Multiple authors, each in format "Name <Email>". Takes precedence over `author` if both exist. |
| `iconUrl` | `string` | No | - | URL to an icon representing the agent. |
| `provider` | `object` | No | - | Information about the agent provider. |
| `provider.organization` | `string` | No | - | Name of the organization providing the agent. |
| `provider.url` | `string` | No | - | URL to the organization's website. |
| `license` | `string` | No | - | License under which the agent definition is released. |

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

#### 5.1.4. Field Details

Each field serves a specific purpose in defining and organizing the agent:

##### Name
The `name` field identifies the agent in human-readable form. AFM implementations **SHALL** use this field to display the agent's name in user interfaces. If not provided, the agent's name can be inferred from the filename of the AFM file.

##### Description
The `description` field provides a concise summary of what the agent does. AFM implementations **SHALL** use this field to display the agent's description in user interfaces. If not provided, the agent's description can be inferred from the markdown body `# Role` section.

##### Version
The `version` field follows [Semantic Versioning](https://semver.org/) conventions (MAJOR.MINOR.PATCH). AFM implementations **SHALL** use this field to display the agent's version in user interfaces. If not provided, the agent's version can be inferred as `0.0.0`.

##### Namespace
The `namespace` field enables logical grouping of related agents. AFM implementations **SHALL** use this field to organize agents into logical groups or categories. If not provided, the agent's namespace is defaulted to `default`.

##### Author/Authors
The `author` field (single) or `authors` field (multiple) credits the creators of the agent definition. If the Author name and Email are provided, the `author` field **SHALL** be formatted as `Name <Email>`. When both fields are provided, `authors` takes precedence.

##### Icon URL
The `iconUrl` field specifies a URL to an icon representing the agent. This is **OPTIONAL** but recommended for visual representation in user interfaces. AFM implementations **SHALL** use this field to display the agent's icon in user interfaces, if available.

##### License
The `license` field specifies the terms under which others can use, modify, or distribute the agent definition. It is **OPTIONAL** but recommended for clarity.

### 5.2 Agent Capabilities

This section defines the schema for agent capabilities - the tools, skills, or functions that the agent can perform.
