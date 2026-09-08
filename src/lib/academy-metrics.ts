import { academyLevels } from "@/data/academy";

export function getAcademyXp(completed: string[]) {
  return Math.round(academyLevels.reduce((total, level) => {
    const levelLessons = level.modules.reduce((sum, module) => sum + module.lessonCount, 0);
    const completedLessons = level.modules
      .filter((module) => completed.includes(module.id))
      .reduce((sum, module) => sum + module.lessonCount, 0);
    return total + (completedLessons / levelLessons) * level.xp;
  }, 0));
}

export const totalAcademyModules = academyLevels.reduce((sum, level) => sum + level.modules.length, 0);
export const totalAcademyXp = academyLevels.reduce((sum, level) => sum + level.xp, 0);
