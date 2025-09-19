## The AFM Agent Workbench for VS Code**

This document outlines the architecture for a comprehensive Visual Studio Code extension that provides a full suite of tools for discovering, creating, and editing Agent File Markdown (`.afm`) files.

### **1. Executive Summary**

The proposed solution is to build an "AFM Agent Workbench" directly within VS Code. This extension will go beyond simple editing to provide a complete lifecycle management experience for agents. Key features include a dedicated Activity Bar icon, an "Agent Explorer" for discovering agents within a workspace, a wizard for creating new agents, and a powerful **side-by-side editing view**. This dual view will pair the raw power of the native text editor with a structured, graphical "Agent UI View" for managing agent metadata and configuration, offering an experience that is both intuitive for beginners and efficient for expert users.

### **2. Core User Experience & Usecases**

The extension will be built around three primary use cases:

#### **Case 1: Creating a New Agent**

A user can initiate a "Create New Agent" command via the Command Palette or the new AFM Activity. This will launch a webview-based wizard that guides the user through providing initial metadata like `name` and `namespace`. Upon saving, a new `.afm.md` file is created and opened in the main editor view.

#### **Case 2: Listing & Discovering Agents**

A new AFM icon in the Activity Bar will open the "Agent Explorer" in the primary side panel. This view will scan the current workspace for all `.afm` and `.afm.md` files and display them in a structured list, grouped by namespace. Users can click on any agent in this list to open it.

#### **Case 3: Opening & Editing an Agent**

Opening an `.afm.md` file, either from the Agent Explorer or the standard File Explorer, will trigger the extension's primary editing interface: a **side-by-side split view**.

  * **Left Pane:** The standard, native VS Code text editor, showing the raw source of the `.afm.md` file.
  * **Right Pane:** A custom graphical editor, the **"Agent UI View,"** which provides a structured, profile-like interface for viewing and editing the agent's properties.

### **3. Key UI Components & Technical Implementation**

This experience will be built using a combination of VS Code's most powerful extension APIs.

#### **3.1. AFM Activity & Agent Explorer**

  * **API:** `contributes.viewsContainers` and `contributes.views` with a `WebviewViewProvider`.
  * **Function:** This component will provide the AFM icon in the Activity Bar and the content for the side panel, which lists all agents in the workspace.

#### **3.2. Side-by-Side Editor: The Native + Custom Editor Pattern**

  * **API:** `contributes.customEditors` and the `vscode.CustomTextEditorProvider` API.
  * **Function:** We will register a **Custom Editor** for `.afm.md` files. When a user opens a file, the custom "Agent UI View" will open. We will ensure the native text editor is also visible in an adjacent pane, with both views kept in sync.

### **4. The Agent UI View: A Detailed Breakdown**

This custom editor view is the graphical interface for the agent. It will be a webview composed of several interactive sections. It implements **two-way data synchronization**: changes in the UI are reflected in the file on save, and changes in the file are reflected in the UI.

#### **4.1. Agent Metadata Overview**

This is the primary section of the view, designed as a profile card for the agent, based on your provided schema.

  * **UI:** A card-based layout showing the agent's icon, name, description, and other key metadata like `namespace`, `version`, `license`, `authors`, and `provider`.
  * **Interactivity:**
      * **In-Place Editing:** Users can click on any field to edit its value directly. Changes are staged and applied to the file upon saving.
      * **Add Optional Fields:** A "+" button allows users to add optional metadata fields from a dropdown list, ensuring they don't have to remember every possible key.
  * **Data Mapping:** Each field in this UI maps directly to a key in the YAML front matter of the `.afm.md` file.

  Schema Overview

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

#### Field Definitions {#agent-field-definitions}

Each field serves a specific purpose in defining and organizing the agent:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| [`name`](#field-name) | `string` | No | Identifies the agent in human-readable form.<br>Default: inferred from the filename of the AFM file.<br>AFM implementations **SHALL** use this field to display the agent's name in user interfaces. |
| [`description`](#field-description) | `string` | No | Provides a concise summary of what the agent does.<br>Default: inferred from the markdown body `# Role` section.<br>AFM implementations **SHALL** use this field to display the agent's description in user interfaces. |
| [`version`](#field-version) | `string` | No | [Semantic version](https://semver.org/) of the agent definition (MAJOR.MINOR.PATCH).<br>Default: "0.0.0".<br>AFM implementations **SHALL** use this field to display the agent's version in user interfaces. |
| [`namespace`](#field-namespace) | `string` | No | Logical grouping category for the agent.<br>Default: "default".<br>AFM implementations **SHALL** use this field to organize agents into logical groups or categories. |
| [`author`](#field-author) | `string` | No | Single author in format `Name <Email>`.<br>Credits the creator of the agent definition. If both `author` and `authors` fields are provided, `authors` takes precedence. |
| [`authors`](#field-authors) | `string[]` | No | Multiple authors, each in format `Name <Email>`.<br>Credits the creators of the agent definition. Takes precedence over `author` if both exist. |
| [`iconUrl`](#field-iconurl) | `string` | No | URL to an icon representing the agent.<br>This is **OPTIONAL** but recommended for visual representation in user interfaces.<br>AFM implementations **SHALL** use this field to display the agent's icon in user interfaces. |
| [`provider`](#field-provider) | `object` | No | Information about the organization providing the agent.<br>This is **OPTIONAL** but recommended for attribution.<br>See the [Provider Object](#provider-object) below for details. |
| [`license`](#field-license) | `string` | No | License under which the agent definition is released.<br>This is **OPTIONAL** but recommended for clarity. |

**<a id="provider-object"></a>Provider Object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| [`provider.organization`](#field-provider-organization) | `string` | No | Name of the organization providing the agent. |
| [`provider.url`](#field-provider-url) | `string` | No | URL to the organization's website. |


#### **4.2. Agent Instruction View**

  * **Function:** This section will display a rendered HTML view of the main Markdown content of the file, representing the agent's core instructions or role. This provides a clean, readable view of the agent's prompt.

#### **4.3. Interface Configuration**

  * **Function:** A structured UI for defining the agent's inputs and outputs. It will include a toggle to switch between `Function` and `Service` types, and interactive tables for adding, editing, and removing input/output parameters.

#### **4.4. Connections**

  * **Function:** A tabbed interface to manage the agent's connections to external services. This will include dedicated UIs for configuring connections to **MCP Servers** and peer agents, with fields for names, endpoints, and other relevant settings.

### **5. `package.json` Manifest Snippet**

```json
{
  "name": "afm-extension",
  "contributes": {
    "viewsContainers": {
      "activitybar": [{
        "id": "afm-container",
        "title": "AFM Agents",
        "icon": "media/afm-icon.svg"
      }]
    },
    "views": {
      "afm-container": [{
        "id": "afm.agentExplorer",
        "name": "Agent Explorer",
        "type": "webview"
      }]
    },
    "customEditors": [
      {
        "viewType": "afm.agentUiView",
        "displayName": "AFM Agent View",
        "selector": [
          {
            "filenamePattern": "*.afm"
          },
          {
            "filenamePattern": "*.afm.md"
          }
        ]
      }
    ]
  }
}
```