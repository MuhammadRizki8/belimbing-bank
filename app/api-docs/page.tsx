import { swaggerSpec } from '@/lib/swagger';
import Swagger from '@/components/swagger';

export default async function ApiDocPage() {
  const spec = (await Promise.resolve(swaggerSpec)) as Record<string, unknown>;
  return (
    <section className="container">
      <Swagger spec={spec} />
    </section>
  );
}
