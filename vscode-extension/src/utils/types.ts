export interface AfmMetadata {
    name?: string;
    description?: string;
    version?: string;
    namespace?: string;
    license?: string;
    authors?: string[];
    provider?: {
        organization?: string;
        url?: string;
    };
    icon?: string;
}

export interface AfmInterface {
    type: 'function' | 'service';
    inputs?: { [key: string]: string };
    outputs?: { [key: string]: string };
    path?: string;
    method?: string;
}

export interface AfmConnection {
    type: 'mcp-server' | 'peer-agent';
    name: string;
    transport?: string;
    command?: string;
    url?: string;
    endpoint?: string;
    toolFilters?: string[];
}

export interface AfmDocument {
    metadata: AfmMetadata;
    interface?: AfmInterface;
    connections?: AfmConnection[];
    content: string;
}
