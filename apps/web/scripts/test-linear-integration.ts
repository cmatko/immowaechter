#!/usr/bin/env tsx

/**
 * Test Script für Linear API Integration
 * 
 * Testet die echte Linear API Integration mit einem Test-Task
 */

import { getTeamIdByKey, getOrCreateLabels, createLinearIssue } from '../lib/linear-api';
import { LinearTaskSuggestion } from './utils/learnings-analyzer';

async function testLinearIntegration(): Promise<void> {
  try {
    console.log('🧪 Testing Linear API Integration...\n');
    
    // Prüfe Environment Variable
    if (!process.env.LINEAR_API_TOKEN) {
      console.log('⚠️  LINEAR_API_TOKEN not found - running in dry-run mode');
      console.log('   To test with real API, set LINEAR_API_TOKEN environment variable');
      console.log('   Example: LINEAR_API_TOKEN=your_token npm run test:linear-integration');
      return;
    }
    
    console.log('✅ LINEAR_API_TOKEN found');
    
    // Test 1: Team finden
    console.log('\n📋 Test 1: Finding team "KOT"...');
    const teamId = await getTeamIdByKey('KOT');
    console.log(`✅ Team found: ${teamId}`);
    
    // Test 2: Labels verwalten
    console.log('\n📋 Test 2: Managing labels...');
    const testLabels = ['testing', 'auto-generated', 'test-healing'];
    const labelIds = await getOrCreateLabels(teamId, testLabels);
    console.log(`✅ Labels processed: ${labelIds.length} labels`);
    
    // Test 3: Test-Task erstellen
    console.log('\n📋 Test 3: Creating test task...');
    const testTask: LinearTaskSuggestion = {
      title: '🧪 Test Task from Healing System',
      description: `**Test Task**

This is a test task created by the self-healing system to verify Linear API integration.

**Purpose**: Testing the healing system's ability to create real Linear tasks.

**Generated**: ${new Date().toISOString()}

**System**: ImmoWächter Test Healing System`,
      priority: 4, // Low
      labels: ['testing', 'auto-generated', 'test-healing'],
      reasoning: 'Testing Linear API integration for the healing system',
      estimatedTime: '5 minutes'
    };
    
    const result = await createLinearIssue({
      title: testTask.title,
      description: testTask.description,
      teamId: teamId,
      priority: testTask.priority,
      labelIds: labelIds
    });
    
    if (result.success && result.issue) {
      const taskUrl = result.issue.url || `https://linear.app/kotto/issue/${result.issue.identifier}`;
      console.log(`✅ Test task created successfully!`);
      console.log(`   URL: ${taskUrl}`);
      console.log(`   ID: ${result.issue.identifier}`);
      
      console.log('\n🎉 All tests passed! Linear API integration is working.');
    } else {
      throw new Error('Failed to create test task');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  testLinearIntegration().catch(console.error);
}

export { testLinearIntegration };
