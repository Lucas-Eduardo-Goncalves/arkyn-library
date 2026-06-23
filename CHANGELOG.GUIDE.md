# Guia Oficial para Geração Incremental de Changelogs da Arkyn

Este documento define o processo obrigatório para geração de changelogs da Arkyn.

Seu objetivo é garantir que todos os changelogs sejam produzidos de forma incremental, consistente e seguindo exatamente o padrão adotado pela biblioteca.

---

## Objetivo

A partir do último changelog já existente e da versão atual do repositório, gerar automaticamente todos os changelogs faltantes até alcançar a versão mais recente.

Exemplo:

Último changelog existente:

```
v3.0.1-beta.147
```

Versão atual do repositório:

```
v3.0.1-beta.150
```

Você deverá gerar:

```
CHANGELOG-3.0.1-beta.148.md
CHANGELOG-3.0.1-beta.149.md
CHANGELOG-3.0.1-beta.150.md
```

Cada arquivo deve representar exclusivamente as alterações daquela versão específica.

---

## Entrada esperada

Sempre serão fornecidas duas informações:

### 1. Último changelog gerado

Exemplo:

```
3.0.1-beta.147
```

Esta é considerada a última release já documentada.

---

### 2. Versão atual do repositório

Exemplo:

```
3.0.1-beta.150
```

Esta é considerada a release mais recente existente.

---

## Processo obrigatório

### Etapa 1 — Determinar as versões faltantes

Identifique todas as versões existentes entre:

```
última versão documentada + 1
```

e

```
versão atual do repositório
```

inclusive.

Exemplo:

Última documentada:

```
147
```

Atual:

```
150
```

Resultado:

```
148
149
150
```

---

### Etapa 2 — Processar cada versão individualmente

Para cada versão faltante:

1. Localize o commit responsável pela publicação dessa versão.

2. Localize o commit responsável pela publicação da versão imediatamente anterior.

3. Considere apenas os commits existentes entre esses dois pontos.

Exemplo:

Para gerar:

```
CHANGELOG-3.0.1-beta.149.md
```

utilize exclusivamente os commits entre:

```
release 3.0.1-beta.148
```

e

```
release 3.0.1-beta.149
```

Nunca utilize commits fora desse intervalo.

---

### Etapa 3 — Identificar commits de release

A identificação pode ser feita através de evidências como:

- atualização de versões nos arquivos do monorepo;
- alterações em package.json;
- alterações em lockfiles;
- tags;
- convenções adotadas pelo projeto;
- commits explícitos de publicação.

Caso existam múltiplos candidatos, investigue os diffs para determinar qual representa efetivamente a release.

---

### Etapa 4 — Revisar alterações

Analise cuidadosamente todos os commits relevantes.

Quando necessário:

- investigue os arquivos modificados;
- leia os diffs completos;
- avalie impacto real;
- entenda o comportamento introduzido.

Nunca documente alterações apenas pela mensagem do commit quando ela for insuficiente.

---

## O que deve ser ignorado

Não inclua no changelog:

- merge commits sem impacto funcional;
- commits automáticos sem mudanças reais;
- ajustes cosméticos sem impacto para consumidores;
- reorganizações internas irrelevantes;
- refatorações puramente internas;
- alterações temporárias revertidas antes da release;
- atualizações de dependências sem efeito perceptível na API ou comportamento.

---

## Como consolidar mudanças

Agrupe alterações relacionadas.

Evite duplicações.

Exemplo:

Errado:

- Corrigido comportamento X.
- Corrigido bug em X.
- Ajustado X.

Correto:

- Corrigido o comportamento de X, eliminando falhas relacionadas ao fluxo Y e garantindo funcionamento consistente.

---

## Escrita obrigatória

Cada item deve:

- ser orientado ao consumidor da Arkyn;
- explicar benefício ou impacto;
- utilizar linguagem clara;
- evitar termos vagos;
- evitar copiar mensagens de commit;
- descrever comportamento observável.

Nunca reproduza commits literalmente.

---

## Breaking Changes

Caso existam alterações incompatíveis:

1. Crie obrigatoriamente a seção:

```
## Breaking Changes
```

2. Explique claramente:

- o que mudou;
- quem é afetado;
- como migrar;
- exemplos antes/depois quando aplicável.

Se não houver incompatibilidades, omita essa seção.

---

## Estrutura obrigatória

Cada changelog deve seguir exatamente o mesmo padrão do arquivo de referência mais recente.

Utilize as mesmas categorias existentes no modelo fornecido.

Exemplos:

- Changes By Package;
- Breaking Changes;
- Notes.

Nunca invente novas seções sem necessidade.

---

## Formato obrigatório

Nome do arquivo:

```
CHANGELOG-{versão}.md
```

Exemplo:

```
CHANGELOG-3.0.1-beta.149.md
```

Estrutura inicial:

```md
# Arkyn Releases

## v{versão}

Date: YYYY-MM-DD

Status: Resumo objetivo da release.
```

O estilo, tom e organização devem reproduzir fielmente o modelo de changelog existente.

---

## Ordem de execução

Execute exatamente nesta sequência:

1. Identificar versões faltantes;
2. Para cada versão:
   - localizar release anterior;
   - localizar release atual;
   - listar commits intermediários;
   - analisar diffs;
   - consolidar alterações;
   - gerar o Markdown;
   - validar o resultado;

3. Prosseguir para a próxima versão;
4. Finalizar somente após gerar todos os arquivos faltantes.

---

## Validação obrigatória

Antes de concluir cada arquivo:

Verifique que:

- nenhum commit anterior à release anterior foi incluído;
- nenhum commit posterior à release atual foi incluído;
- todos os commits relevantes foram considerados;
- não existem duplicações;
- o texto está consistente com o padrão Arkyn;
- exemplos de migração foram incluídos quando necessários;
- o Markdown está pronto para publicação.

---

## Saída esperada

Entregue exclusivamente os arquivos Markdown correspondentes às versões faltantes.

Exemplo:

Se a entrada for:

Último changelog:

```
3.0.1-beta.147
```

Versão atual:

```
3.0.1-beta.150
```

A saída deverá conter apenas:

```
CHANGELOG-3.0.1-beta.148.md
CHANGELOG-3.0.1-beta.149.md
CHANGELOG-3.0.1-beta.150.md
```

Todos completamente preenchidos, validados e seguindo fielmente o padrão oficial dos changelogs da Arkyn.
