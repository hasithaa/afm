# Guideline: A Rich Editor Experience for AFM

To make Agent Flavored Markdown (AFM) accessible and powerful for all developers, a rich editor that combines a visual, low-code interface with a powerful text editor is the ideal solution. This document outlines a guideline for building such an editor using a **Hub and Spoke** model as its core visual paradigm.

This approach provides an intuitive, configurable view that lowers the barrier to entry for low-code users while enhancing the development experience for pro-code developers.

## The "Hub and Spoke" Model for AFM

<div class="grid" markdown>

<div class="grid__col" markdown>
The Hub and Spoke model is a perfect visual metaphor for an AFM file. It features a central hub representing the agent's core identity, with spokes radiating outwards to represent its various capabilities and connections.

This visual organization makes the agent's architecture immediately clear and provides an intuitive interface for both viewing and configuring the agent.
</div>

<div class="grid__col" markdown>
<div class="svg-container">
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <defs>
    <style>
      .hub { fill: #E1F5FE; stroke: #0288D1; stroke-width: 2; }
      .hub-text { font-size: 20px; font-weight: bold; text-anchor: middle; fill: #01579B; }
      .spoke { fill: #FFF3E0; stroke: #FB8C00; stroke-width: 2; }
      .spoke-text { font-size: 14px; text-anchor: middle; fill: #E65100; }
      .group-text { font-size: 16px; font-weight: bold; text-anchor: middle; fill: #455A64; }
      .connector { stroke: #B0BEC5; stroke-width: 2; }
      .icon { font-family: 'Arial Unicode MS', 'sans-serif'; font-size: 30px; text-anchor: middle; }
    </style>
  </defs>

  <rect x="325" y="250" width="150" height="100" rx="20" class="hub"/>
  <text x="400" y="305" class="hub-text">AFM Agent</text>

  <g>
    <line x1="400" y1="250" x2="400" y2="150" class="connector"/>
    <circle cx="400" cy="100" r="50" class="spoke"/>
    <text x="400" y="95" class="icon">💬</text>
    <text x="400" y="125" class="spoke-text">Instructions</text>
  </g>

  <g>
    <line x1="325" y1="300" x2="150" y2="150" class="connector"/>
    <circle cx="100" cy="100" r="50" class="spoke"/>
    <text x="100" y="95" class="icon">🧠</text>
    <text x="100" y="125" class="spoke-text">Model Provider</text>
  </g>

  <g>
    <line x1="475" y1="300" x2="650" y2="150" class="connector"/>
    <circle cx="700" cy="100" r="50" class="spoke"/>
    <text x="700" y="95" class="icon">💾</text>
    <text x="700" y="125" class="spoke-text">Memory</text>
  </g>

  <text x="150" y="400" class="group-text">MCP Connections</text>
  <g>
    <line x1="325" y1="350" x2="150" y2="450" class="connector"/>
    <circle cx="100" cy="500" r="50" class="spoke"/>
    <text x="100" y="495" class="icon">🔗</text>
    <text x="100" y="525" class="spoke-text">GitHub Server</text>
  </g>
  <g>
    <line x1="350" y1="350" x2="250" y2="450" class="connector"/>
    <circle cx="200" cy="500" r="50" class="spoke"/>
    <text x="200" y="495" class="icon">📁</text>
    <text x="200" y="525" class="spoke-text">Filesystem</text>
  </g>


  <text x="650" y="400" class="group-text">Peer Agents (A2A)</text>
  <g>
    <line x1="475" y1="350" x2="650" y2="450" class="connector"/>
    <circle cx="700" cy="500" r="50" class="spoke"/>
    <text x="700" y="495" class="icon">👥</text>
    <text x="700" y="525" class="spoke-text">Peer Agent</text>
  </g>

</svg>
</div>

*Conceptual representation of the Hub and Spoke model for AFM editors*
</div>

</div>

## The Hub: The Agent's Core Identity

The Hub is the central element of the visual canvas, representing the agent's intrinsic definition. It combines the agent's metadata with its core instructions.

<div class="grid cards" markdown>

-   :material-circle-medium: **Mapping**
    
    The Hub maps to the AFM file's root-level metadata (like `author`, `version`) and the entire **Markdown body**, which defines the agent's `role` and `instructions`.

-   :material-gesture-tap: **Functionality**
    
    Clicking the Hub would open a comprehensive editing view:
    
    - **Configuration Forms:** Clean input forms for editing basic metadata.
    - **Rich Text Editor:** A full-featured Markdown editor for authoring the agent's system prompt and instructions, providing a seamless writing experience.

</div>

## The Spokes: Extensible Agent Capabilities

Each Spoke is a distinct, connectable capability that extends the agent's core functionality. These are visually represented as satellite nodes linked to the central Hub.

<div class="grid cards" markdown>

-   :material-brain: **Model Provider Spoke**
    
    ---
    
    **Mapping:** A proposed `model` section in the front matter.
    
    **Functionality:** A form with rich UX elements would allow users to select a provider from a dropdown, choose a specific model, and configure parameters like temperature and token limits using sliders and text fields.

-   :material-memory: **Memory Spoke**
    
    ---
    
    **Mapping:** A proposed `memory` section in the front matter.
    
    **Functionality:** A configuration panel to define memory type (e.g., short-term, long-term) and provide connection details for persistent storage.

-   :material-tools: **MCP Server Spokes**
    
    ---
    
    **Mapping:** The `connections.mcp.servers` list. These spokes should be **logically grouped** under an "MCP Connections" or "Tools" category, with a **separate Spoke for each configured server**.
    
    **Functionality:** Clicking a specific MCP server Spoke (e.g., "github_api") opens a form to configure its `transport` and `authentication`. The UI should intelligently group inner elements for clarity.

-   :material-account-group: **Peer Agent (A2A) Spokes**
    
    ---
    
    **Mapping:** The `connections.a2a` section. These spokes should be **logically grouped** under "Peer Agents" or "Collaboration," with a **separate Spoke for each configured peer**.
    
    **Functionality:** The configuration form would manage the peer agent's endpoint and other A2A-specific settings.

</div>

## Visual Design Considerations

<div class="grid" markdown>

<div class="grid__col" markdown>
### Icons and Visual Cues

For all spokes, icons should be used to provide an intuitive, at-a-glance understanding of the capability:

- Use recognizable logos (like a GitHub icon for an MCP connection to GitHub)
- Use consistent color coding for different spoke types
- Provide visual indicators for configuration status (complete/incomplete)
</div>

<div class="grid__col" markdown>
### Interaction Model

The editor should support both mouse-driven and keyboard navigation:

- Drag-and-drop for creating and connecting spokes
- Context menus for quick actions
- Keyboard shortcuts for power users
- Support for zooming and panning on the canvas
</div>

</div>

## Bridging the Gap

This visual model provides a powerful, low-code abstraction for AFM, while the underlying AFM file remains the single source of truth—perfectly bridging the gap between visual configuration and pro-code development.

!!! note  "Implementation Note:"

    While this document presents a guideline for AFM editors, specific UI layouts, color schemes, and exact visual representations are implementation details that may vary across different editor environments.

<style>
.grid__col {
  padding: 1rem;
  background-color: var(--md-code-bg-color);
  border-radius: 0.5rem;
}

.svg-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}
</style>
