# Peepo Oracle

Development workspace and learning repository.

## Structure

```
.
├── docs/                      # Knowledge & documentation
│   ├── concepts/              #   Concept guides (Oracle, PRP, Clean Code, etc.)
│   └── spring-boot-concept.md #   Spring Boot reference
│
├── projects/                  # Code projects
│   ├── basic-api-spring-boot  #   [submodule] Spring Boot REST API
│   ├── claude-code            #   [submodule] E-granting analysis docs
│   ├── e-ecomserse-demo       #   [submodule] E-commerce app (Vue/React)
│   ├── order-management-demo  #   [submodule] Order management (Spring Boot)
│   ├── personal-demo          #   [submodule] Personal website
│   ├── demo-granting-system   #   Full-stack granting system (React + Express + PostgreSQL)
│   ├── ecommerce-microservices#   Java microservices (Spring Boot + Docker)
│   ├── spring-boot-demo       #   Spring Boot playground
│   ├── task-management-api    #   Task API (Spring Boot + Docker)
│   └── task-tracker-cli       #   CLI task tracker (Java)
│
├── snippets/                  # Code references & study notes
│   └── spring-boot/           #   Spring Boot patterns & snippets
│
├── ψ/                         # Oracle Brain
│   ├── inbox/                 #   Incoming items to process
│   ├── active/                #   Currently working on
│   ├── lab/                   #   Experiments & system design notes
│   ├── learn/                 #   Study materials (gitignored)
│   ├── memory/                #   Learnings, retrospectives, resonance
│   ├── writing/               #   Drafts & ideas
│   ├── outbox/                #   Completed outputs
│   └── archive/               #   Done & stored
│
└── backup/                    # Old files (gitignored)
```

## Submodules

After cloning, initialize submodules:

```bash
git submodule update --init --recursive
```
