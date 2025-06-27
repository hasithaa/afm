---
hide:
  - navigation
  - toc
---

# Agent Flavored Markdown (AFM)

AFM provides a structured, markdown-based format for defining the capabilities, behaviors, and knowledge of AI agents. The goal is to create a universal standard that allows agents to be easily shared, deployed, and understood across different platforms


## Why AFM?

<div class="grid cards" markdown>

- :fontawesome-solid-book-open-reader: __Human-Readability__

    ---

    Utilize a simple, elegant markdown-based syntax that is intuitive for both developers and non-technical stakeholders to read, write, and understand.

- :material-account-group: __Collaboration__

    ---

    AFM is designed to be composable, supporting not only the definition of individual agents but also complex, multi-agent systems where agents can collaborate and delegate tasks to one another.

- :material-handshake: __Interoperability__

    ---

    Provide a standard, unambiguous syntax for agent declaration, ensuring that diverse platforms and tools can consistently use the same agent blueprint.

</div>

## The AFM Workflow

The process is designed to be straightforward. Agents are defined in natural language, allowing everyone can contribute to the agent's capabilities. Once defined, these agents can be deployed and interacted with seamlessly. 
    
<div class="workflow-steps">
    <span class="workflow-step">1. Write the agent in natural language</span>
    <span class="workflow-arrow">→</span>
    <span class="workflow-step">2. Deploy</span>
    <span class="workflow-arrow">→</span>
    <span class="workflow-step">3. Interact</span>
</div>

!!! warning "WIP"
    Update this section with more detailed explanations and a diagram.

## Get Started with AFM

Ready to dive in? Read the full specification to learn the syntax, or visit our interactive playground to start building your own agent.

<div class="button-container">
    <a href="spec/" class="md-button md-button--primary">Read the Specification</a>
    <a href="/try-it/" class="md-button">Try It!</a>
</div>


<style>
  /* Workflow steps styling */
  .workflow-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .workflow-step {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    border-radius: 0.8rem;
    background-color: var(--md-primary-fg-color--light);
    color: var(--md-primary-bg-color);
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .workflow-arrow {
    font-size: 1.5rem;
    color: var(--md-typeset-fg-color-light);
  }
  
  /* Button container styling */
  .button-container {
    text-align: center;
    margin-top: 1.5rem;
  }
</style>
