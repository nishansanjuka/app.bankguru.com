# BankGuru - Comprehensive Project Documentation

## Project Overview

**BankGuru** is a comprehensive financial services comparison and analytics platform built with Next.js 15, designed to help users find the best banking solutions. The platform provides a modern, responsive interface for comparing various financial products including banking accounts, loans, insurance, and investment products.

### Key Features
- 🏦 **Financial Product Comparison** - Compare banking products, loans, insurance, and investments
- 🤖 **AI-Powered GuruBot** - Intelligent chatbot for financial guidance
- 🔐 **Multi-tier Authentication** - Role-based access control with Clerk
- 📊 **Admin Dashboard** - Comprehensive management interface
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 📱 **Responsive Design** - Mobile-first approach
- 🌐 **Multi-language Support** - English and Sinhala support

## Tech Stack

### Frontend
- **Framework**: Next.js 15.4.3 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Fonts**: Geist, Nunito, Raleway, Noto Serif Sinhala
- **Icons**: Lucide React, Radix UI Icons

### Backend & Services
- **Authentication**: Clerk (Multi-org support)
- **File Storage**: AWS S3
- **Database**: External API integration
- **Webhooks**: Clerk organization management
- **AI Integration**: Custom GuruBot API

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint with Next.js config
- **Build Tool**: Next.js with Turbopack
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## Project Structure

```
app.bankguru.com/
├── app/                              # Next.js App Router
│   ├── (authenticated)/              # Protected routes
│   │   ├── (super-admin)/             # Super admin only routes
│   │   │   └── dashboard/             # Admin dashboard
│   │   │       ├── institutions/      # Institution management
│   │   │       ├── products/          # Product management
│   │   │       └── user-management/   # User management
│   │   ├── auth/                      # Auth callbacks
│   │   │   └── callback/              # Post-auth processing
│   │   └── gurubot/                   # AI chatbot interface
│   ├── (unauthorized)/               # Public routes
│   │   ├── (auth)/                    # Sign in/up pages
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (home)/                    # Public pages
│   │   │   ├── calculators/
│   │   │   ├── contact/
│   │   │   ├── faq/
│   │   │   ├── privacy/
│   │   │   └── terms/
│   │   └── services/                  # Product browsing
│   │       └── shares/                # Investment products
│   ├── api/                          # API routes
│   │   ├── compare-products/          # Product comparison
│   │   ├── conversations/             # Chat conversations
│   │   ├── gurubot/                   # AI chatbot
│   │   ├── product-chat/              # Product-specific chat
│   │   └── webhooks/                  # External webhooks
│   ├── globals.css                    # Global styles
│   ├── layout.tsx                     # Root layout
│   └── loading.tsx                    # Loading component
├── components/                        # Reusable components
│   ├── ui/                           # shadcn/ui components
│   ├── catalyst-ui/                  # Custom UI components
│   ├── products/                     # Product-specific components
│   ├── shared/                       # Shared components
│   └── [feature]/                    # Feature-specific components
├── lib/                              # Utility libraries
│   ├── actions/                      # Server actions
│   ├── clerk/                        # Clerk utilities
│   └── utils/                        # General utilities
├── types/                            # TypeScript definitions
├── data/                             # Static data
├── hooks/                            # Custom React hooks
├── providers/                        # Context providers
└── public/                           # Static assets
```

## Core Modules

### 1. Authentication & Authorization

**Technology**: Clerk with multi-organization support

**Features**:
- Multi-tier role system (super_admin, super_standard, admin, standard_user)
- Organization-based access control
- Automatic institution creation via webhooks
- Protected route middleware

**Key Files**:
- `middleware.ts` - Route protection
- `app/api/webhooks/clerk/route.ts` - Organization webhooks
- `lib/clerk/` - Clerk utilities

**Roles & Permissions**:
```typescript
// Role hierarchy
super_admin        // Platform administrator
super_standard     // Platform moderator
admin             // Institution administrator
standard_user     // Institution member
```

### 2. Product Management System

**Core Entities**:
- **Products** - Financial products (loans, accounts, insurance, investments)
- **Product Types** - Categorization system
- **Product Categories** - Broad classifications
- **Institutions** - Financial service providers

**Product Types Supported**:
1. **Banking Accounts** - Savings, checking, deposits
2. **Loans & Financing** - Personal loans, mortgages, car financing
3. **Insurance Products** - Life, health, auto, property, travel
4. **Investment Products** - Mutual funds, stocks, bonds
5. **Credit Cards** - Various card types
6. **Digital Services** - Online banking, mobile apps

**Key Components**:
- `components/products/` - Product display components
- `types/product.ts` - Product type definitions
- `lib/actions/products/` - Product operations

### 3. Institution Management

**Features**:
- Institution registration and verification
- License number tracking
- Logo and branding management
- Country-specific operations

**Institution Types**:
- Commercial Banks
- Development Banks
- Specialized Banks
- Finance Companies
- Leasing Companies
- Insurance Companies
- Investment Firms

### 4. AI-Powered GuruBot

**Capabilities**:
- Product recommendations
- Financial guidance
- Comparative analysis
- Natural language queries
- Context-aware responses

**Integration**:
- Custom API integration
- Real-time chat interface
- Product-specific knowledge
- User conversation history

### 5. Admin Dashboard

**Super Admin Features**:
- Institution management
- Product oversight
- User management
- System configuration
- Analytics and reporting

**Institution Admin Features**:
- Product creation and management
- Team member management
- Performance analytics
- Customer insights

## API Architecture

### REST Endpoints

```typescript
// Product Comparison
POST /api/compare-products
- Compare multiple financial products
- Returns detailed comparison matrix

// AI Chatbot
POST /api/gurubot
- Natural language processing
- Financial guidance and recommendations

// Product Chat
POST /api/product-chat
- Product-specific inquiries
- Contextual information retrieval

// Conversations
GET/POST /api/conversations
GET/POST /api/conversations/[id]
- Chat history management
- Conversation persistence
```

### Webhook Integrations

```typescript
// Clerk Organization Webhooks
POST /api/webhooks/clerk
- organization.created -> Auto-create institution
- organization.updated -> Update institution details
- organization.deleted -> Soft delete institution
```

## Database Schema (Types)

### Core Types

```typescript
// Institution
type Institution = {
  id: string;
  typeId: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  licenseNumber?: string | null;
  countryCode: string;
  isActive: boolean;
  type: InstitutionType;
}

// Product
type Product = {
  id: string;
  institutionId: string;
  productTypeId: string;
  name: string;
  slug: string;
  details: ProductDetails;
  isFeatured: boolean;
  isActive: boolean;
  institution?: Institution;
  productType?: ProductType;
}

// Product Details
type ProductDetails = {
  description: string;
  terms: string;
  fees: string | number;
  eligibility: string | number;
  additionalInfo: DynamicFormField[];
}
```

## UI/UX Design System

### Design Principles
- **Clean & Modern** - Minimalist design approach
- **Accessibility First** - WCAG compliant components
- **Mobile Responsive** - Mobile-first design
- **Consistent Branding** - Unified color scheme and typography

### Component Library
- **Base**: shadcn/ui components
- **Custom**: Catalyst UI extensions
- **Icons**: Lucide React
- **Animations**: CSS animations with Tailwind

### Color Scheme
```css
/* Light Theme */
--primary: oklch(0.556 0 0);
--secondary: oklch(0.97 0 0);
--background: oklch(1 0 0);
--foreground: oklch(0.15 0 0);

/* Dark Theme */
--primary: oklch(0.488 0.243 264.376);
--background: oklch(0.205 0 0);
--foreground: oklch(0.985 0 0);
```

### Typography
- **Primary**: Nunito (300-700 weights)
- **Secondary**: Raleway (300-700 weights)
- **Monospace**: Geist Mono
- **Sinhala**: Noto Serif Sinhala

## Development Workflow

### Environment Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Environment Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=

# API Configuration
MAIN_API_URL=
NEXT_PUBLIC_APP_URL=
GURUBOT_API_URL=

# Institution Configuration
DEFAULT_INSTITUTION_TYPE_ID=
```

### Code Style & Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended configuration
- **Component Structure**: Functional components with hooks
- **State Management**: TanStack Query for server state
- **Styling**: Utility-first with Tailwind CSS

## Deployment

### Vercel Deployment

The application is deployed on Vercel with automated CI/CD via GitHub Actions.

**Deployment Pipeline**:
1. Code push to main branch
2. GitHub Actions workflow triggers
3. Dependencies installation
4. Build process
5. Deployment to Vercel
6. Environment URL update in GitHub deployments

**Build Configuration**:
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "bankguru.s3.ap-south-1.amazonaws.com" },
      { hostname: "s3.ap-south-1.amazonaws.com" },
      { hostname: "img.clerk.com" }
    ]
  }
};
```

## Security Considerations

### Authentication Security
- Multi-factor authentication support
- Role-based access control
- Session management via Clerk
- Webhook signature verification

### Data Protection
- Environment variable encryption
- AWS IAM role-based S3 access
- HTTPS-only communication
- Input validation and sanitization

### API Security
- Rate limiting
- CORS configuration
- Request validation
- Error handling without data exposure

## Performance Optimizations

### Frontend Optimizations
- **Next.js 15 Features**: App Router, Server Components
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Google Fonts optimization
- **Bundle Analysis**: Webpack bundle analyzer

### Caching Strategy
- **Static Generation**: Pre-rendered pages where possible
- **Incremental Static Regeneration**: For dynamic content
- **Client-side Caching**: TanStack Query cache management
- **CDN**: Vercel Edge Network

## Testing Strategy

### Testing Framework
- **Unit Tests**: Jest with React Testing Library
- **Integration Tests**: API route testing
- **E2E Tests**: Playwright (planned)
- **Type Safety**: TypeScript strict mode

### Quality Assurance
- **Code Reviews**: Required for all PRs
- **Automated Testing**: CI/CD pipeline integration
- **Performance Monitoring**: Vercel Analytics
- **Error Tracking**: Integrated error boundaries

## Monitoring & Analytics

### Application Monitoring
- **Vercel Analytics**: Performance metrics
- **Error Boundaries**: React error handling
- **Console Logging**: Structured logging
- **Webhook Monitoring**: Clerk webhook status

### User Analytics
- **User Journey Tracking**: Page views and interactions
- **Conversion Metrics**: Sign-up and engagement rates
- **Performance Metrics**: Core Web Vitals

## Future Roadmap

### Planned Features
1. **Advanced Analytics Dashboard** - Detailed reporting and insights
2. **Mobile Application** - React Native app
3. **Real-time Notifications** - Push notifications for updates
4. **Advanced AI Features** - Enhanced GuruBot capabilities
5. **Multi-currency Support** - International market expansion
6. **API Marketplace** - Third-party integrations
7. **White-label Solutions** - Customizable platform for partners

### Technical Improvements
1. **Database Migration** - Move to dedicated database
2. **Microservices Architecture** - Service decomposition
3. **GraphQL Integration** - Improved API efficiency
4. **Advanced Caching** - Redis implementation
5. **Real-time Features** - WebSocket integration
6. **Enhanced Security** - Additional security layers

## Contributing Guidelines

### Development Process
1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request
5. Code review and approval
6. Merge to main branch

### Coding Standards
- Follow TypeScript strict mode
- Use ESLint configuration
- Maintain component documentation
- Write comprehensive tests
- Follow Git commit conventions

## Support & Documentation

### Internal Documentation
- API documentation in `/docs`
- Component Storybook (planned)
- Database schema documentation
- Deployment guides

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Authentication](https://clerk.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Last Updated**: August 10, 2025
**Version**: 0.1.0
**Maintainer**: BankGuru Development Team
