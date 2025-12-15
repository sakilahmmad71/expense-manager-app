# Support

Welcome to Expenser App! We're here to help you get the most out of the application. Here are the various ways you can get support:

## 📚 Documentation

Before asking for help, please check our documentation:

- **[README.md](README.md)** - Project overview and quick start
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute to the project
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guides and configurations
- **[CHANGELOG.md](CHANGELOG.md)** - What's new and what's changed

## 🤔 Getting Help

### 💬 GitHub Discussions

For general questions, ideas, and community discussions:

- **[Start a Discussion](https://github.com/sakilahmmad71/expense-manager-app/discussions)**
- Search existing discussions first
- Use appropriate categories (Q&A, Ideas, General, etc.)

### 🐛 Bug Reports

If you've found a bug:

- **[Create a Bug Report](https://github.com/sakilahmmad71/expense-manager-app/issues/new?template=bug_report.yml)**
- Check existing issues first to avoid duplicates
- Follow the bug report template
- Include screenshots and system information

### ✨ Feature Requests

Have an idea for improvement?

- **[Submit a Feature Request](https://github.com/sakilahmmad71/expense-manager-app/issues/new?template=feature_request.yml)**
- Explain the problem your feature would solve
- Provide detailed description and use cases

### 📝 Documentation Issues

Found unclear or missing documentation?

- **[Report Documentation Issues](https://github.com/sakilahmmad71/expense-manager-app/issues/new?template=documentation.yml)**
- Suggest specific improvements
- Help us make docs better for everyone

## 🚀 Quick Help

### Common Issues

#### Installation Problems

```bash
# Clear cache and reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Build Issues

```bash
# Ensure you have the right Node version
node --version  # Should be 18+ or 20+

# Clean build
pnpm run build
```

#### Docker Issues

```bash
# Rebuild containers
make dev-rebuild

# Check logs
make dev-logs
```

### Environment Setup

Make sure you have the correct environment file:

```bash
# Copy example file
cp .env.example .env

# Edit with your settings
# Set VITE_API_URL to your backend URL
```

## 📞 Contact Information

### Maintainer

- **Name**: Shakil Ahmed
- **GitHub**: [@sakilahmmad71](https://github.com/sakilahmmad71)
- **Email**: [sakilahmmad71@gmail.com](mailto:sakilahmmad71@gmail.com)

### Security Issues

For security-related issues, please see our [Security Policy](SECURITY.md).

### Response Times

- **Bug reports**: 2-5 business days
- **Feature requests**: 1-2 weeks
- **Documentation issues**: 1-3 business days
- **Security issues**: Within 48 hours

## 🎯 Before You Ask

To get the fastest help:

1. **Search first** - Check existing issues and discussions
2. **Be specific** - Include error messages, screenshots, and system info
3. **Minimal example** - Provide the smallest code example that shows the issue
4. **Environment details** - OS, browser, Node version, etc.
5. **Steps to reproduce** - Clear, step-by-step instructions

## 🤝 Contributing

Want to help improve Expenser App?

- Read our [Contributing Guidelines](CONTRIBUTING.md)
- Check out [good first issues](https://github.com/sakilahmmad71/expense-manager-app/labels/good%20first%20issue)
- Join the discussion in [GitHub Discussions](https://github.com/sakilahmmad71/expense-manager-app/discussions)

## 🌟 Community Guidelines

When seeking support:

- Be respectful and patient
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)
- Help others when you can
- Share your solutions when you find them

## 📈 Useful Resources

- **React Documentation**: https://reactjs.org/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs
- **Vite Guide**: https://vitejs.dev/guide
- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **Docker Documentation**: https://docs.docker.com

---

Thank you for using Expenser App! 🚀
