# 🎨 Frontend Guidelines - Markado

Essas guidelines são essenciais para manter consistência visual e estrutural ao longo do desenvolvimento da aplicação Markado utilizando NextJS + AlignUi.

---

## 🔤 Fonts

- **Primary Font:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Fallback:** system-ui, sans-serif

```css
font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
```

---

## 🧩 Preferred UI Library or Framework

Utilizar **AlignUi**, uma biblioteca de componentes baseada no [Radix UI](https://www.radix-ui.com/) e Tailwind CSS.

- **Documentação oficial:** [AlignUi Docs](https://alignui.com/docs)

---

## 🎯 Icon Set

Para manter consistência visual, utilizaremos os ícones da biblioteca [Remix Icon](https://remixicon.com/).

**Instalação:**
```shell
npm install remixicon
```

**Uso:**
```jsx
import 'remixicon/fonts/remixicon.css';

<i className="ri-calendar-line"></i>
```

---

⚠️ **Nota:** Estas guidelines devem ser seguidas rigorosamente para garantir um produto final coeso e com alta qualidade visual e funcional.

