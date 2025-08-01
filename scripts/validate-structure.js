// ================================================================
// scripts/validate-structure.js
// Repository Structure Validation Script
// ================================================================

const fs = require('fs');
const path = require('path');

const requiredDirectories = [
  'assets',
  'assets/css',
  'assets/js',
  'assets/images',
  'shop',
  'shop/js',
  'api',
  'api/shopify',
  'api/forms',
  'api/_utils',
  'auth',
  'account',
  'documents'
];

const requiredFiles = [
  'index.html',
  'products.html',
  'shop/cart.html',
  'shop/js/cart.js',
  'assets/css/global-styles.css',
  'assets/js/global-scripts.js'
];

const deprecatedItems = [
  'shop/checkout.html',
  'shop/confirmation.html',
  'shop/js/shopify-config.js',
  'shop/js/shopify-api-bridge.js',
  'API/',
  'Backups/',
  'backups/'
];

function validateStructure() {
  console.log('🔍 Validating repository structure...');
  
  let errors = 0;
  let warnings = 0;

  // Check required directories
  requiredDirectories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.error(`❌ Missing required directory: ${dir}`);
      errors++;
    } else {
      console.log(`✅ Directory exists: ${dir}`);
    }
  });

  // Check required files
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      console.error(`❌ Missing required file: ${file}`);
      errors++;
    } else {
      console.log(`✅ File exists: ${file}`);
    }
  });

  // Check for deprecated items
  deprecatedItems.forEach(item => {
    if (fs.existsSync(item)) {
      console.warn(`⚠️ Deprecated item still exists: ${item}`);
      warnings++;
    }
  });

  console.log(`\n📊 Validation Summary:`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Warnings: ${warnings}`);

  if (errors > 0) {
    console.error('\n❌ Structure validation failed!');
    process.exit(1);
  } else if (warnings > 0) {
    console.warn('\n⚠️ Structure validation passed with warnings');
  } else {
    console.log('\n✅ Structure validation passed!');
  }
}

if (require.main === module) {
  validateStructure();
}

module.exports = { validateStructure };

// ================================================================
// scripts/validate-security.js
// Security Validation Script
// ================================================================

const fs = require('fs');
const path = require('path');

const sensitivePatterns = [
  /SHOPIFY_ADMIN_API_KEY/g,
  /SHOPIFY_WEBHOOK_SECRET/g,
  /sk_live_/g,
  /sk_test_/g,
  /password\s*[:=]\s*["'][^"']+["']/gi,
  /secret\s*[:=]\s*["'][^"']+["']/gi,
  /token\s*[:=]\s*["'][^"']{20,}["']/gi
];

const frontendDirs = [
  'shop/js',
  'assets/js'
];

function scanFileForSecrets(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];

    sensitivePatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            file: filePath,
            pattern: index,
            match: match.substring(0, 50) + '...'
          });
        });
      }
    });

    return issues;
  } catch (error) {
    console.warn(`⚠️ Could not scan file: ${filePath}`);
    return [];
  }
}

function validateSecurity() {
  console.log('🔒 Validating security configuration...');
  
  let securityIssues = [];

  // Scan frontend directories for secrets
  frontendDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.filter(file => file.endsWith('.js')).forEach(file => {
        const filePath = path.join(dir, file);
        const issues = scanFileForSecrets(filePath);
        securityIssues = securityIssues.concat(issues);
      });
    }
  });

  // Check for required security files
  if (!fs.existsSync('.gitignore')) {
    securityIssues.push({
      type: 'missing_file',
      message: 'Missing .gitignore file'
    });
  }

  if (!fs.existsSync('.env.example')) {
    console.warn('⚠️ Missing .env.example file (recommended)');
  }

  // Report issues
  if (securityIssues.length > 0) {
    console.error('\n❌ Security issues found:');
    securityIssues.forEach((issue, index) => {
      if (issue.file) {
        console.error(`${index + 1}. Potential secret in ${issue.file}: ${issue.match}`);
      } else {
        console.error(`${index + 1}. ${issue.message}`);
      }
    });
    process.exit(1);
  } else {
    console.log('✅ No security issues detected');
  }
}

if (require.main === module) {
  validateSecurity();
}

module.exports = { validateSecurity };

// ================================================================
// scripts/sync-shopify-products.js
// Shopify Product Synchronization Script
// ================================================================

const path = require('path');

async function syncShopifyProducts() {
  console.log('🔄 Syncing Shopify products...');
  
  try {
    // This would integrate with your Shopify API
    // For now, just a placeholder that validates API connectivity
    
    const requiredEnvVars = [
      'SHOPIFY_DOMAIN',
      'SHOPIFY_STOREFRONT_TOKEN'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
      console.log('Skipping Shopify sync in development mode');
      return;
    }

    console.log('✅ Shopify environment variables configured');
    console.log('🚀 Ready for product synchronization');
    
    // Add actual sync logic here when API functions are deployed
    
  } catch (error) {
    console.error('❌ Error syncing Shopify products:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  syncShopifyProducts();
}

module.exports = { syncShopifyProducts };
