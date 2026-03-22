import { generateAllWebsiteFiles } from '../../client/src/lib/dynamic-website-generator.js';
import type { BusinessData } from '../../shared/schema.js';
import JSZip from 'jszip';

export interface NetlifyDeploymentOptions {
  apiKey: string;
  siteName: string;
  files: Record<string, string>; // filename -> content
}

export interface NetlifySiteInfo {
  id: string;
  name: string;
  url: string;
  admin_url: string;
  deploy_url: string;
  state: 'current' | 'processing' | 'error';
  created_at: string;
  updated_at: string;
}

export class NetlifyService {
  private baseUrl = 'https://api.netlify.com/api/v1';

  async createSite(apiKey: string, siteName: string): Promise<NetlifySiteInfo> {
    const response = await fetch(`${this.baseUrl}/sites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: siteName,
        repo: null, // Deploy without Git repository
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create Netlify site: ${error}`);
    }

    return await response.json();
  }

  async updateSite(apiKey: string, siteId: string, updates: { name?: string }): Promise<NetlifySiteInfo> {
    const response = await fetch(`${this.baseUrl}/sites/${siteId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update Netlify site: ${error}`);
    }

    return await response.json();
  }

  async deploySite(apiKey: string, siteId: string, files: Record<string, string>): Promise<{ id: string; url: string; state: string }> {
    // Create a zip file with all the website files
    const zip = new JSZip();

    for (const [filename, content] of Object.entries(files)) {
      zip.file(filename, content);
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    const response = await fetch(`${this.baseUrl}/sites/${siteId}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/zip',
      },
      body: zipBuffer,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to deploy to Netlify: ${error}`);
    }

    return await response.json();
  }

  async getSite(apiKey: string, siteId: string): Promise<NetlifySiteInfo> {
    const response = await fetch(`${this.baseUrl}/sites/${siteId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get Netlify site: ${error}`);
    }

    return await response.json();
  }

  async deleteSite(apiKey: string, siteId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/sites/${siteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete Netlify site: ${error}`);
    }
  }

  async listSites(apiKey: string): Promise<NetlifySiteInfo[]> {
    const response = await fetch(`${this.baseUrl}/sites`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to list Netlify sites: ${error}`);
    }

    return await response.json();
  }

  async testConnection(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Deploy a website to Netlify with all necessary files
   */
  async deployWebsite(
    apiKey: string,
    businessData: BusinessData,
    selectedTemplate: string,
    siteName?: string
  ): Promise<{ siteInfo: NetlifySiteInfo; deployInfo: any }> {
    // Create a new site if siteName is provided, otherwise use existing siteId
    let siteInfo: NetlifySiteInfo;
    if (siteName) {
      siteInfo = await this.createSite(apiKey, siteName);
    } else {
      throw new Error('Site name is required for new deployments');
    }

    // Generate all website files with the correct site URL
    const siteUrl = `https://${siteInfo.name}.netlify.app`;
    const websiteFiles = generateAllWebsiteFiles(businessData, selectedTemplate, siteUrl);

    // Deploy the files
    const deployInfo = await this.deploySite(apiKey, siteInfo.id, websiteFiles);

    return { siteInfo, deployInfo };
  }
}

export const netlifyService = new NetlifyService();