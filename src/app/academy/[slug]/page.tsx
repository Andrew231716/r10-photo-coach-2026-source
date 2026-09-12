import { notFound } from "next/navigation";
import { academyLevels } from "@/data/academy";
import { AcademyLessonReader } from "@/components/academy-lesson";

export function generateStaticParams() {
  return academyLevels.flatMap(level => level.modules.map(module => ({ slug: module.id })));
}
export default async function AcademyModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!academyLevels.some(level => level.modules.some(module => module.id === slug))) notFound();
  return <AcademyLessonReader key={slug} moduleId={slug}/>;
}
