import { GenerationResponse } from './types';

const QW = new Set('the be to of and a in that have i it for not on with as you do at this but by from they we or an will my one all would there their what so up out if about who get which go me when make can like time no just know take into your good some could them see other now only think also after use how our work first well way new want because any should need build user users feature page app data system api create add update delete search filter sort display show send login payment notification dashboard profile settings admin report product service team project mobile web design test database server client'.split(' '));

export function hasMinQuality(t: string): boolean {
  const w = t.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(x => x.length > 1);
  if (w.length < 5) return false;
  return w.filter(x => QW.has(x)).length / w.length >= 0.3;
}

export function tryParseStories(text: string): GenerationResponse | null {
  let j = text.trim();
  if (j.startsWith('```')) {
    j = j.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  if (!j.startsWith('{')) {
    const s = j.indexOf('{');
    const e = j.lastIndexOf('}');
    if (s !== -1 && e > s) j = j.substring(s, e + 1);
  }
  try {
    return JSON.parse(j);
  } catch {
    return null;
  }
}
