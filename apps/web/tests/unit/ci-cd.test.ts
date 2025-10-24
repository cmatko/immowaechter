/**
 * CI/CD Pipeline Tests
 * Testet die CI/CD Konfiguration und Deployment-Funktionalität
 */

describe('CI/CD Pipeline Tests', () => {
  
  describe('GitHub Actions Workflow', () => {
    it('should have valid workflow configuration', () => {
      // Teste, dass die Workflow-Datei existiert
      const fs = require('fs');
      const path = require('path');
      
      const workflowPath = path.join(process.cwd(), '../../.github/workflows/ci-cd.yml');
      expect(fs.existsSync(workflowPath)).toBe(true);
      
      // Teste, dass die Workflow-Datei gültiges YAML ist
      const yaml = require('js-yaml');
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent);
      
      expect(workflow.name).toBe('ImmoWächter CI/CD Pipeline');
      expect(workflow.on).toBeDefined();
      expect(workflow.jobs).toBeDefined();
    });

    it('should have all required jobs', () => {
      const fs = require('fs');
      const path = require('path');
      const yaml = require('js-yaml');
      
      const workflowPath = path.join(process.cwd(), '../../.github/workflows/ci-cd.yml');
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent);
      
      const requiredJobs = ['lint', 'unit-tests', 'e2e-tests', 'security', 'build', 'deploy'];
      
      requiredJobs.forEach(job => {
        expect(workflow.jobs[job]).toBeDefined();
      });
    });

    it('should have proper job dependencies', () => {
      const fs = require('fs');
      const path = require('path');
      const yaml = require('js-yaml');
      
      const workflowPath = path.join(process.cwd(), '../../.github/workflows/ci-cd.yml');
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent);
      
      // Build job sollte von allen anderen Jobs abhängen
      expect(workflow.jobs.build.needs).toEqual(['lint', 'unit-tests', 'e2e-tests', 'security']);
      
      // Deploy job sollte nur bei main branch laufen
      expect(workflow.jobs.deploy.if).toBe("github.ref == 'refs/heads/main'");
    });
  });

  describe('Docker Configuration', () => {
    it('should have valid Dockerfile', () => {
      const fs = require('fs');
      const path = require('path');
      
      const dockerfilePath = path.join(process.cwd(), '../../Dockerfile');
      expect(fs.existsSync(dockerfilePath)).toBe(true);
      
      const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
      expect(dockerfileContent).toContain('FROM node:18-alpine');
      expect(dockerfileContent).toContain('EXPOSE 3000');
      expect(dockerfileContent).toContain('HEALTHCHECK');
    });

    it('should have valid docker-compose configuration', () => {
      const fs = require('fs');
      const path = require('path');
      const yaml = require('js-yaml');
      
      const composePath = path.join(process.cwd(), '../../docker-compose.ci.yml');
      expect(fs.existsSync(composePath)).toBe(true);
      
      const composeContent = fs.readFileSync(composePath, 'utf8');
      const compose = yaml.load(composeContent);
      
      expect(compose.services).toBeDefined();
      expect(compose.services.immowaechter).toBeDefined();
      expect(compose.services.postgres).toBeDefined();
      expect(compose.services.redis).toBeDefined();
    });
  });

  describe('Package.json Scripts', () => {
    it('should have CI/CD scripts', () => {
      const fs = require('fs');
      const path = require('path');
      
      const packagePath = path.join(process.cwd(), '../../package.json');
      const packageContent = fs.readFileSync(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      const requiredScripts = [
        'docker:build',
        'docker:run',
        'docker:compose',
        'ci:test',
        'ci:build',
        'ci:deploy'
      ];
      
      requiredScripts.forEach(script => {
        expect(packageJson.scripts[script]).toBeDefined();
      });
    });
  });

  describe('Security Configuration', () => {
    it('should have audit-ci configuration', () => {
      const fs = require('fs');
      const path = require('path');
      
      const auditPath = path.join(process.cwd(), '../../audit-ci.json');
      expect(fs.existsSync(auditPath)).toBe(true);
      
      const auditContent = fs.readFileSync(auditPath, 'utf8');
      const auditConfig = JSON.parse(auditContent);
      
      expect(auditConfig.moderate).toBe(true);
      expect(auditConfig.high).toBe(true);
      expect(auditConfig.critical).toBe(true);
    });
  });

  describe('Environment Variables', () => {
    it('should have required environment variables for CI/CD', () => {
      const requiredEnvVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'VERCEL_TOKEN',
        'VERCEL_ORG_ID',
        'VERCEL_PROJECT_ID',
        'DOCKER_USERNAME',
        'DOCKER_PASSWORD'
      ];
      
      // Teste, dass die Environment Variables in der CI/CD Pipeline verwendet werden
      const fs = require('fs');
      const path = require('path');
      
      const workflowPath = path.join(process.cwd(), '../../.github/workflows/ci-cd.yml');
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      
      expect(workflowContent).toContain('VERCEL_TOKEN');
      expect(workflowContent).toContain('VERCEL_ORG_ID');
      expect(workflowContent).toContain('VERCEL_PROJECT_ID');
    });
  });

  describe('Build Process', () => {
    it('should have proper build steps', () => {
      const fs = require('fs');
      const path = require('path');
      const yaml = require('js-yaml');
      
      const workflowPath = path.join(process.cwd(), '../../.github/workflows/ci-cd.yml');
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent);
      
      const buildJob = workflow.jobs.build;
      expect(buildJob.steps).toBeDefined();
      
      const stepNames = buildJob.steps.map((step: any) => step.name);
      expect(stepNames).toContain('Install dependencies');
      expect(stepNames).toContain('Build Application');
      expect(stepNames).toContain('Upload Build Artifacts');
    });
  });

  describe('Test Coverage', () => {
    it('should have test coverage reporting', () => {
      const fs = require('fs');
      const path = require('path');
      const yaml = require('js-yaml');
      
      const workflowPath = path.join(process.cwd(), '../../.github/workflows/ci-cd.yml');
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent);
      
      const unitTestsJob = workflow.jobs['unit-tests'];
      expect(unitTestsJob.steps).toBeDefined();
      
      const stepNames = unitTestsJob.steps.map((step: any) => step.name);
      expect(stepNames).toContain('Upload Test Coverage');
    });
  });
});

