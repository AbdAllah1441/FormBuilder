# Form Builder

A dynamic form builder application built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and @dnd-kit for drag & drop functionality.

## Features

- ✅ **Visual Form Builder** - Create forms by adding and configuring questions
- ✅ **Drag & Drop Reordering** - Reorder questions using intuitive drag & drop
- ✅ **Live Preview** - See your form update in real-time as you build it
- ✅ **Multiple Question Types**:
  - Short Answer (text input)
  - Long Answer (textarea)
  - Multiple Choice (Radio buttons)
  - Checkboxes
  - Rating (1-5 scale)
- ✅ **Question Configuration**:
  - Edit question labels
  - Toggle required state
  - Add/remove options for radio and checkbox questions
  - Change question types dynamically
- ✅ **Clean UI** - Split layout with builder on the left and preview on the right
- ✅ **Fully Responsive** - Works on desktop and mobile devices

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** - UI component library
- **@dnd-kit** - Drag & drop functionality
- **React Hooks** - useReducer for state management

## Project Structure

```
formbuilder/
├── app/
│   ├── page.tsx              # Main page with split layout
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── form/
│   │   ├── FormBuilder.tsx   # Main form builder component
│   │   ├── FormPreview.tsx   # Form preview component
│   │   ├── QuestionList.tsx   # Question list with drag & drop
│   │   ├── QuestionEditor.tsx # Question editor component
│   │   ├── QuestionPreview.tsx # Question preview component
│   │   ├── ShortAnswerInput.tsx
│   │   ├── LongAnswerInput.tsx
│   │   ├── RadioInput.tsx
│   │   ├── CheckboxInput.tsx
│   │   └── RatingInput.tsx
│   └── ui/                   # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── checkbox.tsx
│       ├── switch.tsx
│       ├── select.tsx
│       ├── card.tsx
│       └── label.tsx
├── lib/
│   ├── utils.ts              # Utility functions (cn helper)
│   └── form-reducer.ts       # State management reducer
├── types/
│   └── form.ts               # TypeScript type definitions
└── package.json
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Usage

1. **Add Questions**: Use the "Add Question" dropdown to select a question type
2. **Edit Questions**: Click on question fields to edit labels, toggle required state, and modify options
3. **Reorder Questions**: Drag questions by the grip icon (⋮⋮) to reorder them
4. **Preview**: See your form update in real-time on the right side
5. **Delete Questions**: Use the "Delete Question" button to remove questions

## Data Model

Each question has the following structure:

```typescript
interface Question {
  id: string
  type: "short" | "long" | "radio" | "checkbox" | "rating"
  label: string
  required: boolean
  options?: { id: string; label: string }[]  // For radio, checkbox, rating
}
```

## State Management

The application uses React's `useReducer` hook with a custom reducer (`form-reducer.ts`) to manage form state. Actions include:

- `ADD_QUESTION` - Add a new question
- `DELETE_QUESTION` - Remove a question
- `UPDATE_QUESTION` - Update question properties
- `REORDER_QUESTIONS` - Reorder questions via drag & drop
- `ADD_OPTION` - Add an option to radio/checkbox questions
- `DELETE_OPTION` - Remove an option
- `UPDATE_OPTION` - Update option label

## License

MIT
