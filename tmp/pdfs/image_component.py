from pathlib import Path
p=Path('src/components/SiteImage.astro')
p.write_bytes('''---
import { Image } from "astro:assets";
import { imageMetadata } from "astro/assets/utils";
import { readFile } from "node:fs/promises";
import type { HTMLAttributes } from "astro/types";
import { withoutBase } from "@lib/paths";

type Props = Omit<HTMLAttributes<"img">, "src" | "alt" | "width" | "height"> & {
  src: string;
  alt: string;
};

const { src, alt, ...attributes } = Astro.props;
// Content URLs keep their public paths; read the source to reserve its true aspect ratio.
const file = new URL(`../../public${withoutBase(src)}`, import.meta.url);
const { width, height } = await imageMetadata(await readFile(file), src);
---

<Image src={src} alt={alt} width={width} height={height} {...attributes} />
'''.encode())
for f in ['src/components/ImagePlaceholder.astro','src/components/Navigation.astro']:
 p=Path(f);s=p.read_text();s=s.replace('---\n','---\nimport SiteImage from "./SiteImage.astro";\n',1).replace('<img ','<SiteImage ');p.write_bytes(s.encode())
print('Added shared Astro Image wrapper and updated both image renderers.')
