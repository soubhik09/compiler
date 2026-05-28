'use client'

export type Language = 'cpp' | 'javascript' | 'java' | 'c' | 'python'

interface LanguageSelectorProps {
  language: Language
  onChange: (lang: Language) => void
}

const languages: { id: Language; name: string; icon: string }[] = [
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'cpp', name: 'C++', icon: '⚡' },
  { id: 'c', name: 'C', icon: '🔤' },
  { id: 'java', name: 'Java', icon: '☕' },
]

export default function LanguageSelector({ language, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-[#1a1a1d] rounded-lg p-1">
      {languages.map((lang) => (
        <button
          key={lang.id}
          onClick={() => onChange(lang.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sf transition-all ${
            language === lang.id
              ? 'bg-macos-accent text-white shadow-md'
              : 'text-macos-muted hover:text-macos-text hover:bg-white/5'
          }`}
        >
          <span className="text-sm">{lang.icon}</span>
          <span>{lang.name}</span>
        </button>
      ))}
    </div>
  )
}

export const defaultCode: Record<Language, string> = {
  python: `# Hello World in Python
message = "Hello, World!"
print(message)

name = "Developer"
age = 25
print(f"My name is {name} and I am {age} years old.")
`,

  javascript: `// Hello World in JavaScript
const message = "Hello, World!";
console.log(message);

const name = "Developer";
const age = 25;
console.log("My name is " + name + " and I am " + age + " years old.");
`,

  cpp: `// Hello World in C++
#include <iostream>
#include <string>
using namespace std;

int main() {
    string message = "Hello, World!";
    cout << message << endl;

    string name = "Developer";
    int age = 25;
    cout << "My name is " << name << " and I am " << age << " years old." << endl;

    return 0;
}`,

  c: `// Hello World in C
#include <stdio.h>

int main() {
    char message[] = "Hello, World!";
    printf("%s\\n", message);

    char name[] = "Developer";
    int age = 25;
    printf("My name is %s and I am %d years old.\\n", name, age);

    return 0;
}`,

  java: `// Hello World in Java
public class Main {
    public static void main(String[] args) {
        String message = "Hello, World!";
        System.out.println(message);

        String name = "Developer";
        int age = 25;
        System.out.println("My name is " + name + " and I am " + age + " years old.");
    }
}`,
}
