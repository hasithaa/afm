---
hide:
  - navigation
  - toc
---

# Agent Flavored Markdown (AFM)

A simple, markdown-based format for defining AI agents. Write agents in plain text that any platform can understand and deploy.

```markdown
# Role
I'm a friendly math tutor who explains concepts step-by-step.

# Instructions
- Use simple language
- Show your work
- Be encouraging and patient
```

## Why AFM?

<div class="grid cards" markdown>

- :fontawesome-solid-feather: __Simple__

    Write agents in plain markdown. No complex code or proprietary formats required.

- :material-share-variant: __Shareable__

    AFM agents work across different platforms and tools. Write once, deploy anywhere.

- :material-account-group: __Collaborative__

    Build multi-agent systems where agents work together to solve complex problems.

</div>

**Want to learn more?** Check out [Why AFM?](topics/why-afm.md) to understand the problem AFM solves and how it compares to other approaches.

<!-- ## The AFM Workflow

The process is designed to be straightforward. Agents are defined in natural language, allowing everyone can contribute to the agent's capabilities. Once defined, these agents can be deployed and interacted with seamlessly. 
    
<div class="workflow-steps">
    <span class="workflow-step">1. Write the agent in natural language</span>
    <span class="workflow-arrow">→</span>
    <span class="workflow-step">2. Deploy</span>
    <span class="workflow-arrow">→</span>
    <span class="workflow-step">3. Interact</span>
</div>

!!! warning "WIP"
    Update this section with more detailed explanations and a diagram. -->

## Get Started

<div class="button-container">
    <a href="specification.md" class="md-button md-button--primary">Read the Spec</a>
    <a href="../try-it/" class="md-button">Try It Out</a>
    <a href="topics/" class="md-button">Learn More</a>
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
