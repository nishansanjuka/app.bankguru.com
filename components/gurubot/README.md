# GuruBot Component System

A comprehensive chat interface and context system for AI-powered assistance throughout your BankGuru application.

## Features

- **Floating Chat Interface**: Always accessible floating chat button with expandable window
- **Context-aware Integration**: Trigger GuruBot from anywhere in your app
- **Conversation Management**: Persistent conversations with history
- **Loading States**: Real-time feedback during API calls
- **Responsive Design**: Optimized for desktop and mobile
- **Theme Integration**: Seamlessly integrated with your existing design system

## Components

### Core Components

#### `GuruBot`
The main chat interface component with floating behavior.

```tsx
import { GuruBot } from "@/components/gurubot";

// Add to your layout or any page
<GuruBot 
  position="bottom-right" // bottom-right | bottom-left | top-right | top-left
  offset={{ x: 24, y: 24 }} // Distance from edges
/>
```

#### `GuruBotTriggerButton`
Interactive buttons that can trigger GuruBot with predefined queries.

```tsx
import { GuruBotTriggerButton } from "@/components/gurubot";

// Custom query
<GuruBotTriggerButton 
  query="What are the best credit cards for students?"
  variant="ask" // ask | help | recommend
  size="lg"
>
  Ask about Credit Cards
</GuruBotTriggerButton>

// Product-specific query
<GuruBotTriggerButton 
  productName="Premium Savings Account"
  productType="savings account"
  variant="ask"
>
  Learn More
</GuruBotTriggerButton>

// Category recommendations
<GuruBotTriggerButton 
  category="personal loans"
  requirements="first-time borrower with good credit"
  variant="recommend"
>
  Get Recommendations
</GuruBotTriggerButton>
```

#### `GuruBotProductCard`
Floating "Ask about this" button for product cards.

```tsx
import { GuruBotProductCard } from "@/components/gurubot";

<div className="relative">
  {/* Your product card content */}
  <GuruBotProductCard 
    productName="Platinum Credit Card"
    productType="credit card"
  />
</div>
```

#### `GuruBotHelpText`
Clickable help text that triggers GuruBot.

```tsx
import { GuruBotHelpText } from "@/components/gurubot";

<GuruBotHelpText 
  text="What are the eligibility requirements?"
  className="text-sm text-blue-600"
/>
```

## Hooks

### `useGuruBot()`
Core hook for managing GuruBot state.

```tsx
import { useGuruBot } from "@/components/gurubot";

function MyComponent() {
  const { 
    state, 
    sendMessage, 
    toggleChat, 
    openChat, 
    closeChat, 
    clearConversation 
  } = useGuruBot();

  return (
    <div>
      <button onClick={openChat}>
        Open Chat ({state.messages.length} messages)
      </button>
    </div>
  );
}
```

### `useGuruBotTrigger()`
Simplified hook for triggering GuruBot from anywhere.

```tsx
import { useGuruBotTrigger } from "@/hooks/use-gurubot-trigger";

function ProductPage() {
  const { 
    askGuruBot, 
    askAboutProduct, 
    askForRecommendation,
    isLoading 
  } = useGuruBotTrigger();

  const handleAskAboutProduct = () => {
    askAboutProduct("Platinum Credit Card", "credit card");
  };

  const handleGetRecommendations = () => {
    askForRecommendation("credit cards", "cashback rewards");
  };

  const handleCustomQuery = () => {
    askGuruBot("Compare interest rates for home loans");
  };

  return (
    <div>
      <button onClick={handleAskAboutProduct} disabled={isLoading}>
        Ask about this product
      </button>
      <button onClick={handleGetRecommendations} disabled={isLoading}>
        Get recommendations
      </button>
      <button onClick={handleCustomQuery} disabled={isLoading}>
        Compare rates
      </button>
    </div>
  );
}
```

## Setup

### 1. Provider Setup
The GuruBotProvider is already included in your main Providers component.

### 2. API Configuration
Update the API endpoint in `app/api/gurubot/route.ts`:

```typescript
// Replace the mock implementation with your actual API
const response = await fetch('YOUR_GURUBOT_API_ENDPOINT', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.GURUBOT_API_KEY}`
  },
  body: JSON.stringify(body)
});
```

### 3. Environment Variables
Add your API credentials to `.env.local`:

```bash
GURUBOT_API_KEY=your_api_key_here
GURUBOT_API_ENDPOINT=https://your-api-endpoint.com
```

## API Format

### Request Format
```typescript
{
  "query": "string", // Required
  "conversation_id": "string", // Optional
  "include_history": boolean // Optional, default true
}
```

### Response Format
```typescript
{
  "answer": "string",
  "sources": ["string"],
  "conversation_id": "string",
  "query_type": "string",
  "history": [
    {
      "text": "string",
      "role": "user" | "assistant",
      "timestamp": "ISO string"
    }
  ]
}
```

## Styling

The GuruBot components use your existing design system:
- Orange theme colors (`bg-orange-500`, `hover:bg-orange-600`)
- Consistent with your button and card styles
- Responsive design with mobile-first approach
- Dark mode support through your theme system

## Examples

### Product Comparison Page
```tsx
import { GuruBotTriggerButton } from "@/components/gurubot";

function ProductComparison({ products }) {
  return (
    <div>
      <h2>Compare Products</h2>
      <GuruBotTriggerButton 
        query={`Compare these products: ${products.map(p => p.name).join(", ")}`}
        variant="ask"
        className="mb-4"
      >
        Ask GuruBot to Compare
      </GuruBotTriggerButton>
      {/* Product list */}
    </div>
  );
}
```

### FAQ Section
```tsx
import { GuruBotHelpText } from "@/components/gurubot";

function FAQSection() {
  return (
    <div>
      <h3>Common Questions</h3>
      <ul>
        <li>
          <GuruBotHelpText text="What documents do I need for a loan application?" />
        </li>
        <li>
          <GuruBotHelpText text="How long does loan approval take?" />
        </li>
        <li>
          <GuruBotHelpText text="What are the current interest rates?" />
        </li>
      </ul>
    </div>
  );
}
```

### Dashboard Widget
```tsx
import { useGuruBotTrigger } from "@/hooks/use-gurubot-trigger";

function DashboardWidget() {
  const { askForRecommendation } = useGuruBotTrigger();

  return (
    <div className="p-4 border rounded-lg">
      <h3>Need Help?</h3>
      <p>Get personalized recommendations</p>
      <button 
        onClick={() => askForRecommendation("financial products", "your current portfolio")}
        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded"
      >
        Get AI Recommendations
      </button>
    </div>
  );
}
```

## Best Practices

1. **Context-Specific Queries**: Use specific, actionable queries for better responses
2. **User Experience**: Place trigger buttons near relevant content
3. **Loading States**: Always show loading indicators during API calls
4. **Error Handling**: The system includes built-in error handling and user feedback
5. **Accessibility**: All components include proper ARIA labels and keyboard support

## Troubleshooting

### Common Issues

1. **GuruBot not appearing**: Ensure GuruBotProvider is wrapping your app
2. **API errors**: Check your API endpoint and credentials
3. **Styling issues**: Verify Tailwind classes are available
4. **TypeScript errors**: Ensure all type definitions are imported

### Debug Mode
Set `NEXT_PUBLIC_DEBUG_GURUBOT=true` in your environment to enable console logging.
