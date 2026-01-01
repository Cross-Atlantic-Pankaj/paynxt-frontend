/**
 * PM2 Ecosystem Configuration
 * Production-ready process management
 */
module.exports = {
  apps: [
    {
      name: 'paynxt-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/home/ubuntu/paynxt-frontend',
      instances: 1, // Use single instance for small servers (t2/t3.small)
      exec_mode: 'fork', // Fork mode uses less memory than cluster
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NODE_OPTIONS: '--max-old-space-size=1536', // Limit Node.js memory to 1.5GB
      },
      // Auto-restart configuration
      autorestart: true,
      watch: false,
      max_memory_restart: '800M', // Restart if memory exceeds 800MB (lower for small servers)
      
      // Logging
      error_file: '/home/ubuntu/paynxt-frontend/logs/pm2-error.log',
      out_file: '/home/ubuntu/paynxt-frontend/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Advanced PM2 features
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Health monitoring
      health_check_grace_period: 3000,
    },
  ],
};

