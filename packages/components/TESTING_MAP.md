# 🧪 Mapa de Geração de Testes para Componentes React

Este documento serve como guia padronizado para IAs gerarem testes de componentes React utilizando **Vitest** e **React Testing Library**.

---

## 📋 Índice

1. [Pré-requisitos](#1-pré-requisitos)
2. [Estrutura de Arquivos](#2-estrutura-de-arquivos)
3. [Anatomia de um Teste](#3-anatomia-de-um-teste)
4. [Categorias de Testes](#4-categorias-de-testes)
5. [Padrões de Nomenclatura](#5-padrões-de-nomenclatura)
6. [Checklist de Cobertura](#6-checklist-de-cobertura)
7. [Exemplos Práticos](#7-exemplos-práticos)
8. [Boas Práticas](#8-boas-práticas)

---

## 1. Pré-requisitos

### Dependências necessárias:

```json
{
  "devDependencies": {
    "vitest": "^4.x",
    "@testing-library/react": "^16.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/user-event": "^14.x",
    "jsdom": "^28.x"
  }
}
```

### Configuração do `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
```

### Configuração do `vitest.setup.ts`:

```typescript
import "@testing-library/jest-dom/vitest";
```

---

## 2. Estrutura de Arquivos

### Localização dos testes:

```
src/
└── components/
    └── [componentName]/
        ├── index.tsx           # Componente
        ├── styles.css          # Estilos
        └── index.test.tsx      # Testes (mesmo diretório)
```

**OU** centralizado:

```
src/
└── components/
    ├── __test__/
    │   └── [componentName].test.tsx
    └── [componentName]/
        ├── index.tsx
        └── styles.css
```

---

## 3. Anatomia de um Teste

### Estrutura básica do arquivo de teste:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ComponentName } from "./index";

// ============================================
// MOCKS (se necessário)
// ============================================
vi.mock("../dependency", () => ({
  dependency: vi.fn(),
}));

// ============================================
// HELPERS/FIXTURES
// ============================================
const defaultProps = {
  // props padrão para os testes
};

const renderComponent = (props = {}) => {
  return render(<ComponentName {...defaultProps} {...props} />);
};

// ============================================
// TESTES
// ============================================
describe("ComponentName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Grupo 1: Renderização
  describe("Rendering", () => {
    it("should render correctly with default props", () => {});
    it("should render children when provided", () => {});
  });

  // Grupo 2: Props
  describe("Props", () => {
    it("should apply custom className", () => {});
    it("should handle variant prop correctly", () => {});
  });

  // Grupo 3: Interações
  describe("Interactions", () => {
    it("should call onClick when clicked", () => {});
    it("should handle keyboard navigation", () => {});
  });

  // Grupo 4: Estados
  describe("States", () => {
    it("should display loading state", () => {});
    it("should display disabled state", () => {});
  });

  // Grupo 5: Acessibilidade
  describe("Accessibility", () => {
    it("should have correct ARIA attributes", () => {});
    it("should be focusable", () => {});
  });
});
```

---

## 4. Categorias de Testes

### 4.1 Testes de Renderização

Verificam se o componente renderiza corretamente.

```typescript
describe("Rendering", () => {
  it("should render correctly with default props", () => {
    renderComponent();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render children content", () => {
    renderComponent({ children: "Click me" });
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should not render when condition is false", () => {
    renderComponent({ show: false });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
```

### 4.2 Testes de Props

Verificam se as props são aplicadas corretamente.

```typescript
describe("Props", () => {
  it("should apply size prop correctly", () => {
    renderComponent({ size: "lg" });
    expect(screen.getByRole("button")).toHaveClass("lg");
  });

  it("should apply variant prop correctly", () => {
    renderComponent({ variant: "outline" });
    expect(screen.getByRole("button")).toHaveClass("outline");
  });

  it("should merge custom className with base classes", () => {
    renderComponent({ className: "custom-class" });
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("should spread additional HTML attributes", () => {
    renderComponent({ "data-testid": "custom-button", id: "btn-1" });
    expect(screen.getByTestId("custom-button")).toHaveAttribute("id", "btn-1");
  });
});
```

### 4.3 Testes de Interação

Verificam eventos e comportamentos do usuário.

```typescript
describe("Interactions", () => {
  it("should call onClick handler when clicked", async () => {
    const handleClick = vi.fn();
    renderComponent({ onClick: handleClick });

    await userEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when disabled", async () => {
    const handleClick = vi.fn();
    renderComponent({ onClick: handleClick, disabled: true });

    await userEvent.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should handle double click", async () => {
    const handleDoubleClick = vi.fn();
    renderComponent({ onDoubleClick: handleDoubleClick });

    await userEvent.dblClick(screen.getByRole("button"));

    expect(handleDoubleClick).toHaveBeenCalledTimes(1);
  });

  it("should handle keyboard events", async () => {
    const handleKeyDown = vi.fn();
    renderComponent({ onKeyDown: handleKeyDown });

    screen.getByRole("button").focus();
    await userEvent.keyboard("{Enter}");

    expect(handleKeyDown).toHaveBeenCalled();
  });
});
```

### 4.4 Testes de Estado

Verificam estados visuais e comportamentais.

```typescript
describe("States", () => {
  it("should show loading spinner when isLoading is true", () => {
    renderComponent({ isLoading: true });
    expect(screen.getByRole("button")).toHaveClass("loadingTrue");
  });

  it("should display loading text when provided", () => {
    renderComponent({ isLoading: true, loadingText: "Loading..." });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is true", () => {
    renderComponent({ disabled: true });
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should be disabled when loading", () => {
    renderComponent({ isLoading: true });
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### 4.5 Testes de Acessibilidade

Verificam conformidade com padrões de acessibilidade.

```typescript
describe("Accessibility", () => {
  it("should have correct role", () => {
    renderComponent();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should support aria-label", () => {
    renderComponent({ "aria-label": "Close modal" });
    expect(screen.getByLabelText("Close modal")).toBeInTheDocument();
  });

  it("should support aria-describedby", () => {
    renderComponent({ "aria-describedby": "help-text" });
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-describedby",
      "help-text",
    );
  });

  it("should be focusable when not disabled", () => {
    renderComponent();
    const button = screen.getByRole("button");
    button.focus();
    expect(button).toHaveFocus();
  });

  it("should have type button by default to prevent form submission", () => {
    renderComponent({ type: "button" });
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});
```

### 4.6 Testes de Variações/Combinações

Verificam diferentes combinações de props.

```typescript
describe("Variations", () => {
  const sizes = ["xs", "sm", "md", "lg"] as const;
  const variants = ["solid", "outline", "ghost"] as const;
  const schemes = ["primary", "success", "danger"] as const;

  sizes.forEach((size) => {
    it(`should render correctly with size="${size}"`, () => {
      renderComponent({ size });
      expect(screen.getByRole("button")).toHaveClass(size);
    });
  });

  variants.forEach((variant) => {
    it(`should render correctly with variant="${variant}"`, () => {
      renderComponent({ variant });
      expect(screen.getByRole("button")).toHaveClass(variant);
    });
  });

  schemes.forEach((scheme) => {
    it(`should render correctly with scheme="${scheme}"`, () => {
      renderComponent({ scheme });
      expect(screen.getByRole("button")).toHaveClass(scheme);
    });
  });
});
```

### 4.7 Testes de Ícones (se aplicável)

Verificam renderização de ícones.

```typescript
describe("Icons", () => {
  it("should render left icon when provided", () => {
    const MockIcon = () => <svg data-testid="left-icon" />;
    renderComponent({ leftIcon: MockIcon });
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("should render right icon when provided", () => {
    const MockIcon = () => <svg data-testid="right-icon" />;
    renderComponent({ rightIcon: MockIcon });
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("should render both icons simultaneously", () => {
    const LeftMock = () => <svg data-testid="left-icon" />;
    const RightMock = () => <svg data-testid="right-icon" />;
    renderComponent({ leftIcon: LeftMock, rightIcon: RightMock });

    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });
});
```

---

## 5. Padrões de Nomenclatura

### Formato do `describe`:

- Use o nome do componente como primeiro `describe`
- Agrupe testes relacionados em `describe` aninhados

### Formato do `it`:

Use o padrão: `should [comportamento esperado] when [condição]`

**Exemplos:**

- ✅ `should render correctly with default props`
- ✅ `should call onClick when button is clicked`
- ✅ `should be disabled when isLoading is true`
- ✅ `should apply custom className when provided`
- ❌ `test button click` (muito vago)
- ❌ `onClick works` (não descreve o cenário)

---

## 6. Checklist de Cobertura

### Antes de considerar os testes completos, verifique:

#### Renderização

- [ ] Renderiza com props padrão
- [ ] Renderiza children corretamente
- [ ] Aplica className customizada
- [ ] Propaga atributos HTML adicionais (data-\*, id, etc.)

#### Props

- [ ] Cada prop documentada tem pelo menos 1 teste
- [ ] Valores default são testados
- [ ] Diferentes valores de cada prop são testados

#### Interações

- [ ] onClick é chamado corretamente
- [ ] Eventos de teclado funcionam (se aplicável)
- [ ] Comportamento quando disabled
- [ ] Foco e blur (se aplicável)

#### Estados

- [ ] Estado de loading (se aplicável)
- [ ] Estado disabled
- [ ] Estados visuais (hover, active, focus via classes)

#### Acessibilidade

- [ ] Role correto
- [ ] Suporte a aria-label
- [ ] Focusable quando apropriado
- [ ] Anúncio de estados para screen readers

#### Edge Cases

- [ ] Props undefined ou null
- [ ] Strings vazias
- [ ] Combinações incomuns de props

---

## 7. Exemplos Práticos

### Exemplo completo de teste para um Button:

Veja o arquivo `/packages/components/src/components/__test__/button.test.tsx` para um exemplo completo e real de como os testes devem ser estruturados.

---

## 8. Boas Práticas

### ✅ FAÇA:

1. **Teste comportamento, não implementação**

   ```typescript
   // ✅ Bom - testa o comportamento
   expect(screen.getByRole("button")).toBeDisabled();

   // ❌ Ruim - testa implementação
   expect(component.state.disabled).toBe(true);
   ```

2. **Use queries apropriadas**

   ```typescript
   // Prioridade de queries:
   // 1. getByRole (mais acessível)
   // 2. getByLabelText
   // 3. getByText
   // 4. getByTestId (último recurso)
   ```

3. **Aguarde operações assíncronas**

   ```typescript
   await userEvent.click(button);
   await waitFor(() => expect(mockFn).toHaveBeenCalled());
   ```

4. **Use userEvent ao invés de fireEvent**

   ```typescript
   // ✅ Simula comportamento real do usuário
   await userEvent.click(button);

   // ❌ Dispara evento diretamente
   fireEvent.click(button);
   ```

5. **Limpe mocks entre testes**
   ```typescript
   beforeEach(() => {
     vi.clearAllMocks();
   });
   ```

### ❌ NÃO FAÇA:

1. **Não teste bibliotecas externas**
   - Não teste se o React renderiza
   - Não teste comportamento do browser

2. **Não use snapshots como teste principal**
   - Snapshots são frágeis e difíceis de manter

3. **Não duplique testes**
   - Cada comportamento deve ser testado uma vez

4. **Não ignore erros do console**
   - Warnings e errors indicam problemas reais

5. **Não dependa de timeouts arbitrários**

   ```typescript
   // ❌ Ruim
   await new Promise((r) => setTimeout(r, 1000));

   // ✅ Bom
   await waitFor(() => expect(element).toBeVisible());
   ```

---

## 📝 Template Rápido

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ComponentName } from "./index";

const defaultProps = {};

const renderComponent = (props = {}) => {
  return render(<ComponentName {...defaultProps} {...props} />);
};

describe("ComponentName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render correctly with default props", () => {
      renderComponent();
      // adicione assertions
    });
  });

  describe("Props", () => {
    // testes de props
  });

  describe("Interactions", () => {
    // testes de interação
  });

  describe("States", () => {
    // testes de estado
  });

  describe("Accessibility", () => {
    // testes de acessibilidade
  });
});
```

---

## 🔄 Fluxo de Trabalho para IAs

Ao receber um componente para testar, siga este fluxo:

1. **Analise o componente**
   - Identifique todas as props e seus tipos
   - Identifique valores default
   - Identifique estados possíveis
   - Identifique eventos/handlers

2. **Crie a estrutura do teste**
   - Use o template fornecido
   - Organize em grupos lógicos

3. **Implemente os testes**
   - Comece pelos testes de renderização
   - Siga com props, interações, estados
   - Finalize com acessibilidade e edge cases

4. **Valide a cobertura**
   - Use o checklist da seção 6
   - Garanta que cada prop/comportamento está coberto

5. **Revise a nomenclatura**
   - Todos os `it` seguem o padrão `should...when...`?
   - Os grupos fazem sentido?

---

**Última atualização:** Março 2026
