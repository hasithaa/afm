---
hide:
  - navigation
  - toc
---

# Agent Flavored Markdown (AFM)

!!! note ""
    
    A specification for describing AI agents in a portable and interoperable way.


AFM provides a structured, markdown-based format for defining the capabilities, behaviors, and knowledge of AI agents. The goal is to create a universal standard that allows agents to be easily shared, deployed, and understood across different platforms

<div class="grid cards" markdown>

- :fontawesome-solid-book-open-reader: __Human-Readability__

    ---

    Utilize a simple, elegant markdown-based syntax that is intuitive for both developers and non-technical stakeholders to read, write, and understand.

- :material-handshake: __Interoperability__

    ---

    Provide a standard, unambiguous syntax for agent definition, ensuring that diverse platforms and tools can consistently use the same agent blueprint.

</div>

## The AFM Workflow

The process is designed to be straightforward, separating agent definition from its execution.
    
<div class="workflow-steps">
    <span class="workflow-step">1. Write in natural language</span>
    <span class="workflow-arrow">→</span>
    <span class="workflow-step">2. Upload</span>
    <span class="workflow-arrow">→</span>
    <span class="workflow-step">3. Interact</span>
</div>

## Get Started with AFM

Ready to dive in? Read the full specification to learn the syntax, or visit our interactive playground to start building your own agent.

<div class="button-container">
    <a href="spec/" class="md-button md-button--primary">Read the Specification</a>
    <a href="/try-it/" class="md-button">Try It!</a>
</div>



<!-- Custom styles -->
<style>
  /* Hero banner styling */
  /* .hero-banner {
    padding: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    background-color: var(--md-code-bg-color);
    border-radius: 0.1rem;
  }
  
  .hero-banner h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }
  
  .hero-banner p {
    font-size: 1.25rem;
    margin-top: 0;
  }
  
   */
  
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
