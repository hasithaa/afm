# Why AFM? A New Standard for a Multi-Agent World

The world of artificial intelligence is experiencing a Cambrian explosion. AI agents, designed to perform tasks autonomously, are being built by countless teams across the globe, using a vast array of different technologies and frameworks. This rapid innovation is exciting, but it has created a fragmented and chaotic landscape. How can an agent built by one team interact with an agent built by another? How can we define, manage, and scale these digital workers without getting locked into proprietary systems or drowning in boilerplate code?

Agent Flavored Markdown (AFM) is an open standard designed to solve this problem. It provides a common language for describing what an agent is, what it can do, and how it behaves, paving the way for a truly interoperable ecosystem.

## The Developer's Dilemma

Today, developers face a frustrating dilemma when building AI agents, regardless of their preferred coding style.

<div class="grid cards" markdown>

-   ### Pro-Code Developers
    
    The experience of defining an agent is often verbose and unnecessarily complex. The agent's core identity—its instructions and personality—is frequently just a multi-line string literal buried within imperative code. This makes the agent difficult to manage, version, and share.

-   ### Low-Code Developers
    
    Visual, low-code tooling can hide this complexity behind a friendly interface. However, the underlying representation is typically a proprietary Domain-Specific Language (DSL). This locks developers into a specific platform, limits flexibility, and makes it difficult to integrate with other systems.

</div>

We are at a unique moment in technological history. Given the highly experimental and rapidly evolving nature of AI, committing to a permanent, language-level syntax for agents would be premature. At the same time, the current library-based approach provides a poor and inefficient developer experience.

## The Solution: A Declarative Framework

The optimal path forward is a declarative agent framework that serves as a powerful middle ground. This framework is built upon a dedicated syntax designed to be both human-readable and machine-parsable, bridging the gap between pro-code and low-code development.

<div class="grid cards" markdown>

-   :fontawesome-solid-file-lines: **Declarative Syntax**
    
    Move away from complex, imperative code. AFM allows developers to *declare* an agent's properties, tools, and configurations in a simple, text-based format.

-   :material-shape-outline: **Adaptable**
    
    By building the framework around a flexible format rather than embedding it deep within a programming language, we can evolve the standard alongside the fast-changing AI landscape.

-   :material-account-group: **Unified Experience**
    
    Provide a clean, declarative model that works seamlessly for both developers writing code and those using a visual, low-code interface. The same AFM file can power both experiences.

-   :material-swap-horizontal: **Agent Duality**
    
    Natively support the dual nature of agents as both callable functions within an application and as exposable services for interoperability. This critical configuration is managed declaratively, not through code.

</div>

## Why Markdown? The Perfect Format for Agents

Finding a format that is both easily readable by humans and easily parsable by machines is crucial. While formats like JSON, TOML, or YAML are excellent for configuration, an AI agent is more than just configuration—its essence is captured in its natural language instructions.

This is why **Markdown** emerges as the ideal candidate.

<div class="grid" markdown>

<div class="grid__col" markdown>
### Benefits of Markdown

- :material-check: Familiar to software engineers
- :material-check: Low barrier to entry
- :material-check: Human-readable and machine-parsable
- :material-check: Perfect for natural language instructions
- :material-check: Supports structured and semi-structured content
</div>

<div class="grid__col" markdown>
### AFM Structure

**Front Matter (Structured Metadata):**
The YAML front matter provides a structured, machine-readable section for defining the agent's configuration (its name, tools, connections, etc.).

**Markdown Body (Semi-structured Document):**
The body of the document provides a human- and AI-first authoring experience for the agent's detailed system prompt.
</div>

</div>

This elegant structure allows an agent's configuration, its documentation, and its core instructions to coexist in a single, version-controllable file. AFM is more than just a file format; it's a foundational step toward a future where intelligent agents can collaborate seamlessly, unlocking the true potential of a connected, multi-agent world.

<style>
.grid__col {
  padding: 1rem;
  background-color: var(--md-code-bg-color);
  border-radius: 0.5rem;
}
</style>
