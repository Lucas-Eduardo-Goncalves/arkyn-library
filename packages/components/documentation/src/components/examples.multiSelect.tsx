import { MultiSelect } from "@components";
import {
  Globe,
  Hash,
  Search,
  Star,
  Tag,
  User,
  Users,
  MapPin,
  Code,
  Building,
  Briefcase,
  Heart,
  Book,
  Music,
  Camera,
  Coffee,
  Gamepad2,
  Monitor,
  Palette,
} from "lucide-react";

import { Box } from "../ui/box";
import { Row } from "../ui/row";

// Sample data for examples
const basicOptions = [
  { label: "Opção 1", value: "option1" },
  { label: "Opção 2", value: "option2" },
  { label: "Opção 3", value: "option3" },
  { label: "Opção 4", value: "option4" },
];

const categoriesOptions = [
  { label: "Tecnologia", value: "tech" },
  { label: "Design", value: "design" },
  { label: "Marketing", value: "marketing" },
  { label: "Vendas", value: "sales" },
  { label: "Recursos Humanos", value: "hr" },
  { label: "Financeiro", value: "finance" },
];

const countriesOptions = [
  { label: "Brasil", value: "br" },
  { label: "Estados Unidos", value: "us" },
  { label: "Reino Unido", value: "uk" },
  { label: "França", value: "fr" },
  { label: "Alemanha", value: "de" },
  { label: "Japão", value: "jp" },
  { label: "Canadá", value: "ca" },
  { label: "Austrália", value: "au" },
];

const skillsOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "React", value: "react" },
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C#", value: "csharp" },
  { label: "PHP", value: "php" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
];

const tagsOptions = [
  { label: "Urgente", value: "urgent" },
  { label: "Importante", value: "important" },
  { label: "Baixa Prioridade", value: "low" },
  { label: "Em Progresso", value: "progress" },
  { label: "Concluído", value: "done" },
  { label: "Revisão", value: "review" },
];

const departmentsOptions = [
  { label: "Desenvolvimento", value: "dev" },
  { label: "Design", value: "design" },
  { label: "Marketing", value: "marketing" },
  { label: "Vendas", value: "sales" },
  { label: "Suporte", value: "support" },
  { label: "Administração", value: "admin" },
];

const hobbiesOptions = [
  { label: "Leitura", value: "reading" },
  { label: "Música", value: "music" },
  { label: "Fotografia", value: "photography" },
  { label: "Culinária", value: "cooking" },
  { label: "Games", value: "gaming" },
  { label: "Esportes", value: "sports" },
  { label: "Viagem", value: "travel" },
  { label: "Arte", value: "art" },
];

function MultiSelectExamples() {
  return (
    <Box title="MultiSelect">
      <Row>
        <MultiSelect
          name="variant-solid"
          options={basicOptions}
          placeholder="Variant solid (default)"
          label="Solid variant:"
        />
        <MultiSelect
          name="variant-outline"
          options={basicOptions}
          placeholder="Variant outline"
          label="Outline variant:"
          variant="outline"
        />
        <MultiSelect
          name="variant-underline"
          options={basicOptions}
          placeholder="Variant underline"
          label="Underline variant:"
          variant="underline"
        />
      </Row>

      <Row>
        <MultiSelect
          name="size-md"
          options={basicOptions}
          placeholder="Size md (default)"
          label="Medium size:"
        />
        <MultiSelect
          name="size-lg"
          options={basicOptions}
          placeholder="Size lg"
          label="Large size:"
          size="lg"
        />
      </Row>

      <Row>
        <MultiSelect
          name="left-icon"
          options={categoriesOptions}
          placeholder="Selecione categorias"
          label="Left icon:"
          leftIcon={Tag}
        />
        <MultiSelect
          name="prefix"
          options={countriesOptions}
          placeholder="Selecione países"
          label="With prefix:"
          prefix="País:"
        />
        <MultiSelect
          name="prefix-icon"
          options={countriesOptions}
          placeholder="Selecione países"
          label="Prefix and icon:"
          prefix="Loc:"
          leftIcon={Globe}
        />
      </Row>

      <Row>
        <MultiSelect
          name="searchable"
          options={skillsOptions}
          placeholder="Busque e selecione habilidades"
          label="Searchable:"
          leftIcon={Search}
          isSearchable
        />
        <MultiSelect
          name="close-on-select"
          options={tagsOptions}
          placeholder="Selecione tags"
          label="Close on select:"
          leftIcon={Hash}
          closeOnSelect
        />
      </Row>

      <Row>
        <MultiSelect
          name="loading"
          options={categoriesOptions}
          placeholder="Carregando..."
          label="Loading state:"
          isLoading
        />
        <MultiSelect
          name="loading-with-icon"
          options={skillsOptions}
          placeholder="Carregando habilidades..."
          label="Loading with icon:"
          leftIcon={Code}
          isLoading
        />
      </Row>

      <Row>
        <MultiSelect
          name="disabled"
          options={basicOptions}
          placeholder="MultiSelect desabilitado"
          label="Disabled:"
          disabled
        />
        <MultiSelect
          name="readonly"
          options={departmentsOptions}
          placeholder="MultiSelect apenas leitura"
          label="Read only:"
          readOnly
          defaultValue={["dev", "design"]}
        />
      </Row>

      <Row>
        <MultiSelect
          name="required"
          options={categoriesOptions}
          placeholder="Campo obrigatório"
          label="Required field:"
          showAsterisk
        />
        <MultiSelect
          name="error"
          options={skillsOptions}
          placeholder="Campo com erro"
          label="With error:"
          errorMessage="Selecione pelo menos uma habilidade"
        />
      </Row>

      <Row>
        <MultiSelect
          name="default-values"
          options={hobbiesOptions}
          placeholder="Selecione hobbies"
          label="With default values:"
          leftIcon={Heart}
          defaultValue={["reading", "music"]}
        />
        <MultiSelect
          name="custom-not-found"
          options={[]}
          placeholder="Sem opções"
          label="Empty options:"
          notFoundText="Nenhuma opção disponível no momento"
        />
      </Row>

      <Row>
        <MultiSelect
          name="departments"
          options={departmentsOptions}
          placeholder="Selecione departamentos"
          label="Departments:"
          leftIcon={Building}
          variant="outline"
          size="lg"
          isSearchable
          closeOnSelect={false}
        />
        <MultiSelect
          name="team-roles"
          options={[
            { label: "Frontend Developer", value: "frontend" },
            { label: "Backend Developer", value: "backend" },
            { label: "Full Stack Developer", value: "fullstack" },
            { label: "DevOps Engineer", value: "devops" },
            { label: "QA Engineer", value: "qa" },
            { label: "Product Manager", value: "pm" },
          ]}
          placeholder="Selecione funções"
          label="Team roles:"
          leftIcon={Users}
          variant="underline"
        />
      </Row>

      <Row>
        <MultiSelect
          name="creative-areas"
          options={[
            { label: "Design Gráfico", value: "graphic" },
            { label: "UI/UX Design", value: "uiux" },
            { label: "Ilustração", value: "illustration" },
            { label: "Animação", value: "animation" },
            { label: "Branding", value: "branding" },
            { label: "Motion Graphics", value: "motion" },
          ]}
          placeholder="Áreas criativas"
          label="Creative areas:"
          leftIcon={Palette}
          isSearchable
          notFoundText="Área não encontrada"
        />
        <MultiSelect
          name="work-locations"
          options={[
            { label: "São Paulo - SP", value: "sp" },
            { label: "Rio de Janeiro - RJ", value: "rj" },
            { label: "Belo Horizonte - MG", value: "mg" },
            { label: "Remote", value: "remote" },
            { label: "Híbrido", value: "hybrid" },
          ]}
          placeholder="Locais de trabalho"
          label="Work locations:"
          leftIcon={MapPin}
          closeOnSelect
          variant="outline"
        />
      </Row>
    </Box>
  );
}

export { MultiSelectExamples };
