<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
<!--   <title>Emitter Leaderboard with Redis - README</title> -->
<!--   <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    h1, h2 { color: #007acc; }
    code { background-color: #f4f4f4; padding: 0.2em 0.4em; border-radius: 4px; }
    pre { background-color: #f4f4f4; padding: 1em; border-radius: 5px; overflow-x: auto; }
    ul { margin-left: 1em; }
    .section { margin-bottom: 2em; }
  </style> -->
</head>
<body>

<h1>Emitter Leaderboard with Redis</h1>

<div class="section">
  <h2>Overview</h2>
  <p>This project is a full-stack application built with Node.js, TypeScript, and Vite. It incorporates Redis for efficient data handling and caching, making it ideal for leaderboard functionalities and real-time data management.</p>
</div>

<div class="section">
  <h2>Features</h2>
  <ul>
    <li><strong>Real-time Leaderboard</strong>: Updates in real-time to reflect the latest scores.</li>
    <li><strong>Redis Caching</strong>: Implements Redis for high-speed data retrieval and storage.</li>
    <li><strong>Scalable Architecture</strong>: Designed to be scalable with a full-stack setup.</li>
  </ul>
</div>

<div class="section">
  <h2>Prerequisites</h2>
  <p>Ensure you have the following software installed:</p>
  <ul>
    <li><a href="https://nodejs.org/">Node.js</a> (version 14 or above)</li>
    <li><a href="https://redis.io/download">Redis</a></li>
    <li><a href="https://git-scm.com/">Git</a></li>
  </ul>
</div>

<div class="section">
  <h2>Getting Started</h2>
  <p>Follow these steps to set up and run the application on your local system.</p>

  <h3>1. Clone the Repository</h3>
  <pre><code>git clone &lt;repository-url&gt;
cd Emitter-Leaderboard</code></pre>

  <h3>2. Install Dependencies</h3>
  <pre><code>npm install</code></pre>

  <h3>3. Start the Frontend Development Server</h3>
  <pre><code>npm run dev</code></pre>

  <h3>4. Start the Backend Server</h3>
  <pre><code>cd backend
node server.js</code></pre>

  <h3>5. Access the Application</h3>
  <p>Open your browser and go to the local URL:</p>
  <pre><code>http://localhost:3000</code></pre>
  <p>or the port specified in your project configuration. Once there, you should see the application up and running.</p>
  
  <p>Alternatively, access the live deployment at:</p>
  <a href="https://exploding-kitten-1607.netlify.app/" target="_blank">https://exploding-kitten-1607.netlify.app/</a>
</div>

<div class="section">
  <h2>Build for Production</h2>
  <p>To create a production-ready build of the application, run:</p>
  <pre><code>npm run build</code></pre>
  <p>This command bundles the application using Vite, making it ready for deployment.</p>
</div>

<div class="section">
  <h2>Project Structure</h2>
  <p>An overview of the main files and folders in this project:</p>
  <ul>
    <li><strong>index.html</strong> - Main HTML file for the frontend.</li>
    <li><strong>vite.config.ts</strong> - Configuration file for Vite.</li>
    <li><strong>tsconfig.json</strong> - TypeScript configuration.</li>
    <li><strong>package.json</strong> - Contains project metadata, scripts, and dependencies.</li>
  </ul>
</div>

<div class="section">
  <h2>Additional Configuration</h2>
  <p>This project includes configurations for:</p>
  <ul>
    <li><strong>ESLint</strong>: For maintaining code quality.</li>
    <li><strong>PostCSS</strong> and <strong>TailwindCSS</strong>: For utility-first CSS styling.</li>
  </ul>
  <p>You can customize these configurations in the respective files: <code>.eslintrc.js</code>, <code>postcss.config.js</code>, and <code>tailwind.config.js</code>.</p>
</div>

<div class="section">
  <h2>Contributing</h2>
  <p>We welcome contributions! To contribute, please fork this repository, make your changes, and submit a pull request.</p>
</div>

<p>Thank you for checking out the Emitter Leaderboard project! We hope you find it useful and enjoyable to work with.</p>

</body>
</html>
