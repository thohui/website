export const ABOUT: string[] = [
  "I'm a software engineer passionate about creating clean, functional websites and applications. I enjoy working with modern technologies while keeping things simple and accessible.",
  "When I'm not writing code, you can find me reading, exploring the outdoors, going for a run, or tinkering with side projects.",
];

export const SKILLS: string[] = [
  "JavaScript, TypeScript",
  "React, Astro",
  "Rust, Go, Node.js, C#",
  "Git, GitHub, Azure Devops",
  "PostgreSQL, MongoDB, Redis",
  "Linux, Docker",
  "RabbitMQ, NATS",
  "REST, OData, gRPC",
];

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  external: boolean;
}

export const CONTACT_LINKS: ContactLink[] = [
  {
    label: "Email",
    value: "thomas.huisman@outlook.com",
    href: "mailto:thomas.huisman@outlook.com",
    external: false,
  },
  {
    label: "GitHub",
    value: "github.com/thohui",
    href: "https://github.com/thohui",
    external: true,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/tbhuisman",
    href: "https://www.linkedin.com/in/tbhuisman",
    external: true,
  },
];
