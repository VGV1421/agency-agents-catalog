const fs = require('fs');
const path = require('path');

const categories = {
    'engineering': '💻 Engineering',
    'design': '🎨 Design',
    'marketing': '📢 Marketing',
    'product': '📋 Product',
    'support': '🛟 Support',
    'testing': '✅ Testing',
    'spatial-computing': '🥽 Spatial Computing',
    'project-management': '📊 Project Management',
    'specialized': '🎯 Specialized',
    'integrations': '🔌 Integrations',
    'strategy': '🧠 Strategy'
};

const emojis = {
    'Frontend': '🎨', 'Backend': '🏗️', 'DevOps': '🚀', 'AI': '🤖', 'Mobile': '📱',
    'Security': '🔒', 'Rapid': '⚡', 'UI': '🎯', 'UX': '🔍', 'Brand': '🎭',
    'Whimsy': '✨', 'Architect': '🏛️', 'Growth': '📈', 'Content': '📝',
    'Instagram': '📸', 'TikTok': '🎵', 'Reddit': '👽', 'Twitter': '🐦',
    'Sprint': '🎯', 'Trend': '📊', 'Feedback': '💬', 'Support': '🛟',
    'Infrastructure': '⚙️', 'Legal': '⚖️', 'API': '🧪', 'Reality': '🚨',
    'Vision': '🥽', 'XR': '🕶️', 'Spatial': '🌐', 'Analytics': '📊',
    'Finance': '💰', 'Executive': '📋', 'Behavioral': '🧠', 'Accessibility': '♿',
    'Performance': '⚡', 'Tool': '🔧', 'Test': '✅', 'Workflow': '🔄',
    'Project': '📊', 'Studio': '🎬', 'Shepherd': '🐑', 'Experiment': '🧪',
    'Sales': '💼', 'Data': '📊', 'LSP': '📝', 'Cultural': '🌍', 'Developer': '👨‍💻',
    'Agentic': '🤖', 'Orchestrator': '🎼', 'Report': '📑', 'Distribution': '📤',
    'macOS': '💻', 'Terminal': '💻', 'Cockpit': '🎛️', 'Immersive': '🎮',
    'Image': '🖼️', 'Visual': '👁️', 'Storyteller': '📖', 'Inclusive': '🌈',
    'App': '📱', 'Store': '🏪', 'Zhihu': '📱', 'Xiaohongshu': '📕',
    'WeChat': '💬', 'Social': '📢', 'Strategy': '🧠', 'Coordination': '🎼',
    'Nexus': '🔗', 'Quick': '⚡', 'Playbook': '📋', 'Runbook': '📖',
    'Startup': '🚀', 'Enterprise': '🏢', 'Campaign': '📣', 'Incident': '🚨',
    'Metal': '⚙️', 'Interface': '🎨', 'Integration': '🔌'
};

function getEmoji(name) {
    for (const [key, emoji] of Object.entries(emojis)) {
        if (name.toLowerCase().includes(key.toLowerCase())) {
            return emoji;
        }
    }
    return '🤖';
}

function getCategoryFromPath(filePath) {
    const parts = filePath.split('/');
    for (let i = 0; i < parts.length; i++) {
        if (categories[parts[i]]) {
            return parts[i];
        }
    }
    return 'specialized';
}

function parseAgentFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let name = '';
    let description = '';
    let color = 'purple';
    let inFrontMatter = false;
    let frontMatterEnd = 0;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] === '---') {
            if (!inFrontMatter) {
                inFrontMatter = true;
            } else {
                frontMatterEnd = i;
                break;
            }
        } else if (inFrontMatter) {
            if (lines[i].startsWith('name:')) {
                name = lines[i].replace('name:', '').trim();
            } else if (lines[i].startsWith('description:')) {
                description = lines[i].replace('description:', '').trim();
            } else if (lines[i].startsWith('color:')) {
                color = lines[i].replace('color:', '').trim().replace(/"/g, '');
            }
        }
    }
    
    // Si no hay descripción, coger del primer párrafo después del front matter
    if (!description) {
        for (let i = frontMatterEnd + 1; i < Math.min(frontMatterEnd + 10, lines.length); i++) {
            if (lines[i].trim() && !lines[i].startsWith('#')) {
                description = lines[i].trim();
                break;
            }
        }
    }
    
    // Limpiar descripción
    description = description.replace(/\*\*/g, '').substring(0, 150);
    if (description.length > 147) description += '...';
    
    const category = getCategoryFromPath(filePath);
    const emoji = getEmoji(name);
    
    return {
        category,
        name,
        emoji,
        color,
        description,
        whenToUse: 'Ver detalles completos',
        deliverables: 'Prompt completo + guía de uso'
    };
}

function extractAllAgents() {
    const agentsDir = '/root/.openclaw/workspace/agency-agents';
    const agents = [];
    const excludePatterns = [
        '.github', 'README', 'CONTRIBUTING', 'QUICKSTART', 'EXECUTIVE',
        'nexus', 'handoff', 'agent-activation', 'scenario', 'phase',
        'strategy.md', 'coordination.md'
    ];
    
    const files = [];
    function walkDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walkDir(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                const shouldExclude = excludePatterns.some(p => entry.name.includes(p));
                if (!shouldExclude) {
                    files.push(fullPath);
                }
            }
        }
    }
    
    walkDir(agentsDir);
    
    for (const file of files) {
        try {
            const agent = parseAgentFile(file);
            if (agent.name) {
                agents.push(agent);
            }
        } catch (e) {
            console.error('Error parsing:', file, e.message);
        }
    }
    
    return agents;
}

const agents = extractAllAgents();
console.log(JSON.stringify(agents, null, 2));
console.error(`\n// Total: ${agents.length} agentes`);
