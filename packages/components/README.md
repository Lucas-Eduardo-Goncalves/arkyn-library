# @arkyn/components

A modern and comprehensive React component library. Built with TypeScript, featuring smooth animations powered by Framer Motion, and providing a complete set of UI components for building beautiful web applications.

[![npm version](https://img.shields.io/npm/v/@arkyn/components.svg)](https://www.npmjs.com/package/@arkyn/components)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## ✨ Features

- 🎨 **40+ UI Components** - Complete set of modern, accessible components
- 🎭 **Smooth Animations** - Powered by Framer Motion for fluid interactions
- 🪝 **Custom Hooks** - Powerful hooks for form handling, modals, drawers, and more
- 🎯 **TypeScript First** - Full type safety and excellent IntelliSense support
- 📱 **Responsive Design** - Mobile-first approach with modern CSS
- ♿ **Accessibility** - Built with accessibility best practices in mind
- 🎨 **Customizable** - Easy to theme and customize for your brand
- 🚀 **Remix Optimized** - Designed specifically for Remix applications

## 📦 Installation

```bash
npm install @arkyn/components
```

### Peer Dependencies

Make sure you have these peer dependencies installed:

```bash
npm install react react-dom lucide-react
```

## 🚀 Quick Start

```tsx
import { Button, Input, Modal, useModal } from "@arkyn/components";

function App() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      <Input placeholder="Enter your email" />
      <Button onClick={openModal}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <h2>Welcome to Arkyn!</h2>
        <p>This is a beautiful modal component.</p>
      </Modal>
    </div>
  );
}
```

## 🧩 Components

### Form Components

- **Input** - Text input with validation support
- **Textarea** - Multi-line text input
- **Checkbox** - Checkbox with custom styling
- **Radio** - Radio button groups
- **Switch** - Toggle switch component
- **MultiSelect** - Multi-selection dropdown
- **PhoneInput** - International phone number input
- **CurrencyInput** - Currency input with formatting
- **MaskedInput** - Input with custom masking
- **Slider** - Range slider component

### Upload Components

- **FileUpload** - File upload with drag & drop
- **ImageUpload** - Image upload with preview
- **AudioUpload** - Audio file upload component
- **AudioPlayer** - Audio playback component

### Navigation

- **Button** - Versatile button component
- **IconButton** - Icon-only button
- **Tab** - Tab navigation system
- **CardTab** - Card-style tabs
- **Drawer** - Side drawer/panel

### Feedback

- **Alert** - Alert messages with different variants
- **Modal** - Modal dialogs
- **Tooltip** - Contextual tooltips
- **Badge** - Status and count badges
- **Popover** - Floating content containers with positioning

### Layout

- **Table** - Data table components
- **Divider** - Section dividers
- **FieldWrapper** - Form field container
- **FieldLabel** - Form field labels
- **FieldError** - Form field error messages

### Utility

- **ClientOnly** - Client-side only rendering

## 🪝 Hooks

- **useForm** - Comprehensive form state management
- **useModal** - Modal state management
- **useDrawer** - Drawer state management
- **useSlider** - Slider component logic
- **useHydrated** - Check if component is hydrated
- **useScopedParams** - URL parameter utilities
- **useScrollLock** - Prevent page scrolling
- **useToast** - Toast state management

## 🎨 Component Examples

### Button

```tsx
import { Button } from "@arkyn/components";
import { Plus, Save } from "lucide-react";

function Examples() {
  return (
    <>
      {/* Basic button */}
      <Button>Click me</Button>

      {/* With variants */}
      <Button variant="outline" scheme="success">
        Success
      </Button>

      {/* With icons */}
      <Button leftIcon={Plus} rightIcon={Save}>
        Save Item
      </Button>

      {/* Loading state */}
      <Button isLoading loadingText="Saving...">
        Save
      </Button>
    </>
  );
}
```

### Form with Validation

```tsx
import { Input, Button, FormProvider } from "@arkyn/components";

function ContactForm() {
  const onSubmit = (data) => {
    console.log(data);
  };

  const fieldErrors = {
    email: "Email is required",
  };

  return (
    <FormProvider
      fieldErrors={fieldErrors}
      form={<form onSubmit={handleSubmit(onSubmit)} />}
    >
      <Input
        label="E-mail:"
        showAsterisk
        name="email"
        placeholder="your@email.com"
      />

      <Button type="submit">Submit</Button>
    </FormProvider>
  );
}
```

### Modal with Drawer

```tsx
import { Button, Modal, Drawer, useModal, useDrawer } from "@arkyn/components";

function App() {
  const modal = useModal();
  const drawer = useDrawer();

  return (
    <>
      <Button onClick={modal.openModal}>Open Modal</Button>
      <Button onClick={drawer.openDrawer}>Open Drawer</Button>

      <Modal isOpen={modal.isOpen} onClose={modal.closeModal}>
        <h2>Modal Content</h2>
        <Button onClick={modal.closeModal}>Close</Button>
      </Modal>

      <Drawer isOpen={drawer.isOpen} onClose={drawer.closeDrawer}>
        <h2>Drawer Content</h2>
        <Button onClick={drawer.closeDrawer}>Close</Button>
      </Drawer>
    </>
  );
}
```

## 🎯 TypeScript Support

All components are built with TypeScript and provide excellent type safety:

```tsx
import { ButtonProps, InputProps } from "@arkyn/components";

// Extend component props
interface CustomButtonProps extends ButtonProps {
  customProp?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  customProp,
  ...props
}) => {
  return <Button {...props} />;
};
```

## 🎨 Styling

Components come with default styling that can be customized through CSS variables or by overriding the CSS classes. Each component has its own CSS file that can be imported separately if needed.

```css
/* Customize button colors */
.arkyn-button {
  --spotlight-primary: #your-color;
  --text-heading: #your-text-color;
}
```

## 📱 Responsive Design

All components are built with mobile-first responsive design:

```tsx
<Button size="lg">Responsive Button</Button>
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to help improve the library.

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](./LICENSE.txt) file for details.

## 🔗 Links

- [Documentation](https://docs.arkyn.dev)
- [GitHub Repository](https://github.com/Lucas-Eduardo-Goncalves/arkyn)
- [NPM Package](https://www.npmjs.com/package/@arkyn/components)

---

Made with ❤️ by the Arkyn team
