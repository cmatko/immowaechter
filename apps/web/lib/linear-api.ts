// Linear API Service für ImmoWächter
// Verwendet den Linear API Token für Issue-Management

const LINEAR_API_URL = 'https://api.linear.app/graphql';

function getLinearApiToken(): string {
  const token = process.env.LINEAR_API_TOKEN;
  if (!token) {
    throw new Error('LINEAR_API_TOKEN environment variable is required');
  }
  return token;
}

// Linear GraphQL Queries
const QUERIES = {
  // Teams abrufen
  GET_TEAMS: `
    query GetTeams {
      teams {
        nodes {
          id
          name
          key
          description
        }
      }
    }
  `,
  
  // Issues abrufen
  GET_ISSUES: `
    query GetIssues($teamId: String!) {
      team(id: $teamId) {
        issues {
          nodes {
            id
            title
            description
            state {
              name
            }
            priority
            createdAt
            updatedAt
          }
        }
      }
    }
  `,
  
  // Issue erstellen
  CREATE_ISSUE: `
    mutation CreateIssue($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue {
          id
          title
          url
          identifier
        }
      }
    }
  `,
  
  // Labels abrufen
  GET_LABELS: `
    query GetLabels($teamId: String!) {
      team(id: $teamId) {
        labels {
          nodes {
            id
            name
            color
          }
        }
      }
    }
  `,
  
  // Label erstellen
  CREATE_LABEL: `
    mutation CreateLabel($input: IssueLabelCreateInput!) {
      issueLabelCreate(input: $input) {
        success
        issueLabel {
          id
          name
        }
      }
    }
  `,
  
  // Team nach Key finden
  GET_TEAM_BY_KEY: `
    query GetTeamByKey($key: String!) {
      team(key: $key) {
        id
        name
        key
      }
    }
  `
};

// Linear API Client
class LinearAPI {
  private async makeRequest(query: string, variables?: any) {
    const token = getLinearApiToken();
    const response = await fetch(LINEAR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`Linear API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`Linear API GraphQL error: ${JSON.stringify(data.errors)}`);
    }

    return data.data;
  }

  // Teams abrufen
  async getTeams() {
    const data = await this.makeRequest(QUERIES.GET_TEAMS);
    return data.teams.nodes;
  }

  // Issues für ein Team abrufen
  async getIssues(teamId: string) {
    const data = await this.makeRequest(QUERIES.GET_ISSUES, { teamId });
    return data.team.issues.nodes;
  }

  // Issue erstellen
  async createIssue(input: {
    title: string;
    description?: string;
    teamId: string;
    priority?: number;
    labelIds?: string[];
  }) {
    const data = await this.makeRequest(QUERIES.CREATE_ISSUE, { input });
    return data.issueCreate;
  }

  // Team nach Key finden
  async getTeamByKey(key: string) {
    const data = await this.makeRequest(QUERIES.GET_TEAM_BY_KEY, { key });
    return data.team;
  }

  // Labels für ein Team abrufen
  async getLabels(teamId: string) {
    const data = await this.makeRequest(QUERIES.GET_LABELS, { teamId });
    return data.team.labels.nodes;
  }

  // Label erstellen
  async createLabel(input: {
    name: string;
    teamId: string;
    color?: string;
  }) {
    const data = await this.makeRequest(QUERIES.CREATE_LABEL, { input });
    return data.issueLabelCreate;
  }
}

export const linearAPI = new LinearAPI();

// Utility Functions für ImmoWächter
export async function getLinearTeams() {
  try {
    return await linearAPI.getTeams();
  } catch (error) {
    console.error('Error fetching Linear teams:', error);
    return [];
  }
}

export async function getLinearIssues(teamId: string) {
  try {
    return await linearAPI.getIssues(teamId);
  } catch (error) {
    console.error('Error fetching Linear issues:', error);
    return [];
  }
}

export async function createLinearIssue(issueData: {
  title: string;
  description?: string;
  teamId: string;
  priority?: number;
  labelIds?: string[];
}) {
  try {
    return await linearAPI.createIssue(issueData);
  } catch (error) {
    console.error('Error creating Linear issue:', error);
    throw error;
  }
}

// Helper: Team ID nach Key finden
export async function getTeamIdByKey(teamKey: string): Promise<string> {
  try {
    const team = await linearAPI.getTeamByKey(teamKey);
    if (!team) {
      throw new Error(`Team "${teamKey}" not found`);
    }
    return team.id;
  } catch (error) {
    console.error(`Error finding team "${teamKey}":`, error);
    throw error;
  }
}

// Helper: Labels erstellen oder finden
export async function getOrCreateLabels(teamId: string, labelNames: string[]): Promise<string[]> {
  try {
    const existingLabels = await linearAPI.getLabels(teamId);
    const labelIds: string[] = [];
    
    for (const labelName of labelNames) {
      // Suche nach existierendem Label
      const existing = existingLabels.find(
        (label: any) => label.name.toLowerCase() === labelName.toLowerCase()
      );
      
      if (existing) {
        labelIds.push(existing.id);
        console.log(`   ✅ Found existing label: ${labelName}`);
      } else {
        // Erstelle neues Label
        try {
          const newLabel = await linearAPI.createLabel({
            name: labelName,
            teamId: teamId,
            color: getLabelColor(labelName)
          });
          
          if (newLabel.success && newLabel.issueLabel) {
            labelIds.push(newLabel.issueLabel.id);
            console.log(`   ➕ Created new label: ${labelName}`);
          } else {
            console.warn(`   ⚠️  Failed to create label: ${labelName}`);
          }
        } catch (labelError) {
          console.warn(`   ⚠️  Error creating label "${labelName}":`, labelError);
        }
      }
    }
    
    return labelIds;
  } catch (error) {
    console.error('Error managing labels:', error);
    return [];
  }
}

// Helper: Label-Farbe basierend auf Name
function getLabelColor(labelName: string): string {
  const colorMap: { [key: string]: string } = {
    'testing': '#FF6B6B',
    'tech-debt': '#FFA726',
    'refactor': '#66BB6A',
    'optimize': '#42A5F5',
    'standardize': '#AB47BC',
    'auto-generated': '#78909C',
    'coverage': '#26A69A',
    'performance': '#FF7043'
  };
  
  return colorMap[labelName.toLowerCase()] || '#78909C';
}


