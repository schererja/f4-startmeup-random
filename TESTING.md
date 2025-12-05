# Testing Guide

This project uses **Vitest** for unit and component testing, with **React Testing Library** for component tests.

## Setup

Testing dependencies have been installed:

- `vitest` - Fast unit test framework
- `@vitest/ui` - Visual UI for test results
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - DOM matchers
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - JavaScript implementation of web standards

## Running Tests

### Run all tests

```bash
pnpm test
```

### Run tests in watch mode

```bash
pnpm test -- --watch
```

### Run tests with UI

```bash
pnpm test:ui
```

### Run tests with coverage

```bash
pnpm test:coverage
```

### Run specific test file

```bash
pnpm test -- src/lib/__tests__/utils.test.ts
```

## Test Structure

Tests are organized alongside source code in `__tests__` directories:

```
src/
├── lib/
│   ├── utils.ts
│   └── __tests__/
│       └── utils.test.ts
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── __tests__/
│   │       └── button.test.tsx
└── __tests__/
    └── validation.test.ts
```

## Writing Tests

### Utility Function Test

```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "~/lib/utils";

describe("myFunction", () => {
  it("should do something", () => {
    const result = myFunction("input");
    expect(result).toBe("expected output");
  });
});
```

### Component Test

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyComponent } from "~/components/MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });
});
```

### User Interaction Test

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "~/components/ui/button";

describe("Button interactions", () => {
  it("handles click events", async () => {
    const user = userEvent.setup();
    render(<Button onClick={vi.fn()}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    // assertions
  });
});
```

## Common Assertions

```typescript
// DOM presence
expect(element).toBeInTheDocument();
expect(element).toBeVisible();

// Classes
expect(element).toHaveClass("className");

// Attributes
expect(element).toHaveAttribute("href", "/path");

// Text
expect(element).toHaveTextContent("Expected text");

// Disabled state
expect(element).toBeDisabled();

// Value
expect(input).toHaveValue("text");
```

## Current Tests

### 1. **lib/utils.test.ts**

Tests for the `cn` utility function that merges Tailwind classes.

### 2. **components/ui/button.test.tsx**

Tests for the Button component including:

- Rendering
- Variants (primary, outline, destructive, ghost)
- Sizes
- Disabled state
- asChild prop

### 3. **validation.test.ts**

Tests for Zod validation schemas:

- Character validation (SPECIAL stats, name)
- Job validation (name requirements)

## Mocked Dependencies

The following are pre-mocked in `vitest.setup.ts`:

- `next/router` - Next.js router
- `next/navigation` - Next.js navigation utilities

## Tips

1. **Keep tests focused** - Each test should verify one thing
2. **Use descriptive names** - Test names should explain what they test
3. **Use data-testid for complex queries** - For elements without accessible roles
4. **Mock external APIs** - Use `vi.mock()` for external dependencies
5. **Test user behavior** - Focus on how users interact, not implementation details

## CI/CD Integration

To add tests to your CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm test
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
