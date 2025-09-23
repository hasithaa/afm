export interface AfmAuthor {
    name: string;
    email: string;
}

export interface AfmProvider {
    organization?: string;
    url?: string;
}

export interface AfmParameter {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'json' | 'file';
    description?: string;
    required?: boolean;
}

export interface AfmInterfaceSignature {
    input?: AfmParameter[];
    output?: AfmParameter[];
}

export interface AfmServiceExposure {
    http?: {
        path: string;
        authentication?: {
            type: string;
        };
    };
    a2a?: {
        discoverable: boolean;
        agent_card?: {
            name?: string;
            description?: string;
            icon?: string;
        };
    };
}

export interface AfmInterface {
    type: 'function' | 'service';
    signature?: AfmInterfaceSignature;
    exposure?: AfmServiceExposure;
}

export interface AfmMcpServer {
    name: string;
    command: string;
    env?: Record<string, string>;
}

export interface AfmMcpConnections {
    servers?: AfmMcpServer[];
    tool_filter?: {
        allow?: string[];
        deny?: string[];
    };
}

export interface AfmA2aPeer {
    id: string;
    url: string;
    description?: string;
}

export interface AfmA2aConnections {
    peers?: AfmA2aPeer[];
}

export interface AfmConnections {
    mcp?: AfmMcpConnections;
    a2a?: AfmA2aConnections;
}

export interface AfmMetadata {
    // Basic information
    identifier?: string;
    name?: string;
    description?: string;
    version?: string;
    namespace?: string;
    license?: string;
    iconUrl?: string;
    
    // Authors and provider
    authors?: AfmAuthor[];
    provider?: AfmProvider;
    
    // Interface configuration
    interface?: AfmInterface;
    
    // Connections
    connections?: AfmConnections;
    
    // Legacy fields for backward compatibility
    author?: string;
}

export interface AfmDocument {
    metadata: AfmMetadata;
    content: string;
}
