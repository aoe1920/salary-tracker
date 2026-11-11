import { state, getDefaultWorkplace } from './state.js';
import { t, formatShiftType } from './i18n.js';

export { formatShiftType };

export const fmtCurrency = (num) => {
  const val = Math.round(num || 0);
  return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
};

export const fmtHours = (hours) => {
  const h = Number(hours || 0);
  return h.toFixed(2) + ' h';
};

export const hoursToHourMinutes = (hours) => {
  const totalMinutes = Math.round(Number(hours || 0) * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m < 10 ? '0' : ''}${m}m`;
};

export const parseSmartTime = (raw) => {
  if (!raw) return null;
  const str = String(raw).trim().toLowerCase();
  if (!str) return null;

  if (/^\d{1,2}:\d{1,2}$/.test(str)) {
    const [hStr, mStr] = str.split(':');
    const h = parseInt(hStr, 10);
    const m = mStr.length === 1 ? parseInt(mStr, 10) * 10 : parseInt(mStr, 10);
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    }
    return null;
  }

  const hMatch = str.match(/^(\d{1,2})h(?:(\d{1,2}))?$/);
  if (hMatch) {
    const h = parseInt(hMatch[1], 10);
    let m = 0;
    if (hMatch[2]) {
      m = hMatch[2].length === 1 ? parseInt(hMatch[2], 10) * 10 : parseInt(hMatch[2], 10);
    }
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    }
    return null;
  }

  const dotMatch = str.match(/^(\d{1,2})[.,](\d{1,2})$/);
  if (dotMatch) {
    const h = parseInt(dotMatch[1], 10);
    const rawM = dotMatch[2];
    let m = (rawM === '5') ? 30 : (rawM.length === 1 ? parseInt(rawM, 10) * 10 : parseInt(rawM, 10));
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    }
    return null;
  }

  const spaceMatch = str.match(/^(\d{1,2})[\s\-](\d{1,2})$/);
  if (spaceMatch) {
    const h = parseInt(spaceMatch[1], 10);
    const m = spaceMatch[2].length === 1 ? parseInt(spaceMatch[2], 10) * 10 : parseInt(spaceMatch[2], 10);
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    }
    return null;
  }

  if (/^\d{1,4}$/.test(str)) {
    if (str.length === 1 || str.length === 2) {
      const h = parseInt(str, 10);
      if (h === 24) return '00:00';
      if (h >= 0 && h < 24) return String(h).padStart(2, '0') + ':00';
      return null;
    }
    if (str.length === 3) {
      const h1 = parseInt(str.slice(0, 1), 10);
      const m1 = parseInt(str.slice(1), 10);
      if (h1 >= 0 && h1 < 24 && m1 >= 0 && m1 < 60) {
        return String(h1).padStart(2, '0') + ':' + String(m1).padStart(2, '0');
      }
      const h2 = parseInt(str.slice(0, 2), 10);
      const m2 = parseInt(str.slice(2), 10) * 10;
      if (h2 >= 0 && h2 < 24 && m2 >= 0 && m2 < 60) {
        return String(h2).padStart(2, '0') + ':' + String(m2).padStart(2, '0');
      }
      return null;
    }
    if (str.length === 4) {
      const h = parseInt(str.slice(0, 2), 10);
      const m = parseInt(str.slice(2), 10);
      if (h === 24 && m === 0) return '00:00';
      if (h >= 0 && h < 24 && m >= 0 && m < 60) {
        return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
      }
      return null;
    }
  }

  return null;
};

export const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const normalized = timeStr.includes(':') ? timeStr : (parseSmartTime(timeStr) || timeStr);
  const [h, m] = normalized.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

export const calculateHoursDiff = (startStr, endStr, breakMinutes = 0) => {
  const startMins = parseTimeToMinutes(startStr);
  let endMins = parseTimeToMinutes(endStr);
  if (endMins < startMins) {
    endMins += 24 * 60;
  }
  const diffMinutes = Math.max(0, endMins - startMins - (Number(breakMinutes) || 0));
  return Number((diffMinutes / 60).toFixed(2));
};

export const getShiftRate = (shift) => {
  const wp = (shift && shift.workplace && shift.workplace.trim()) ? shift.workplace.trim() : getDefaultWorkplace();
  if (state.settings && state.settings.workplaceRates && state.settings.workplaceRates[wp] !== undefined) {
    const customRate = Number(state.settings.workplaceRates[wp]);
    if (!isNaN(customRate) && customRate >= 0) return customRate;
  }
  const defWp = getDefaultWorkplace();
  if (state.settings && state.settings.workplaceRates && state.settings.workplaceRates[defWp] !== undefined) {
    const defRate = Number(state.settings.workplaceRates[defWp]);
    if (!isNaN(defRate) && defRate >= 0) return defRate;
  }
  return 0;
};

export const getShiftEarnings = (shift, week) => {
  if (!shift) return 0;
  const hours = Number(shift.hours || 0);
  const rate = getShiftRate(shift);
  const ot = Number(shift.otRate) || 1.0;
  const allowance = Number(shift.allowance) || 0;
  const deduction = Number(shift.deduction) || 0;
  return Math.max(0, Math.round(hours * rate * ot + allowance - deduction));
};

export const calculateWeekTotalSalary = (week) => {
  if (!week || !Array.isArray(week.shifts)) return 0;
  return week.shifts.reduce((acc, s) => {
    return acc + getShiftEarnings(s, week);
  }, 0);
};

export const hoursToColonFormat = (hours) => {
  const totalMins = Math.round(Number(hours || 0) * 60);
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${h}:${m < 10 ? '0' : ''}${m}`;
};

export const getVietnameseDayOfWeek = (date = new Date()) => {
  const dayIndex = date.getDay();
  const map = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return map[dayIndex];
};

export const getMondayDate = (d = new Date()) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(monday.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayOfMonth}`;
};

export const parseSmartDate = (raw) => {
  if (!raw) return null;
  const str = String(raw).trim();
  if (!str) return null;

  const curYear = new Date().getFullYear();
  let d = 0, m = 0, y = curYear;

  if (/^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$/.test(str)) {
    const parts = str.split(/[-/.]/);
    y = parseInt(parts[0], 10);
    m = parseInt(parts[1], 10);
    d = parseInt(parts[2], 10);
  } else if (/^\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}$/.test(str)) {
    const parts = str.split(/[-/.]/);
    d = parseInt(parts[0], 10);
    m = parseInt(parts[1], 10);
    y = parseInt(parts[2], 10);
    if (y < 100) y += (y < 70 ? 2000 : 1900);
  } else if (/^\d{1,2}[-/.]\d{1,2}$/.test(str)) {
    const parts = str.split(/[-/.]/);
    d = parseInt(parts[0], 10);
    m = parseInt(parts[1], 10);
  } else if (/^\d{4,8}$/.test(str)) {
    if (str.length === 8) {
      d = parseInt(str.slice(0, 2), 10);
      m = parseInt(str.slice(2, 4), 10);
      y = parseInt(str.slice(4, 8), 10);
    } else if (str.length === 6) {
      d = parseInt(str.slice(0, 2), 10);
      m = parseInt(str.slice(2, 4), 10);
      let shortY = parseInt(str.slice(4, 6), 10);
      y = shortY < 100 ? (shortY < 70 ? 2000 + shortY : 1900 + shortY) : shortY;
    } else if (str.length === 4) {
      d = parseInt(str.slice(0, 2), 10);
      m = parseInt(str.slice(2, 4), 10);
    }
  } else {
    return null;
  }

  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > 2100) return null;

  const dateObj = new Date(y, m - 1, d);
  if (dateObj.getFullYear() !== y || dateObj.getMonth() !== m - 1 || dateObj.getDate() !== d) {
    return null;
  }

  const pad = (n) => String(n).padStart(2, '0');
  return {
    year: y,
    month: m,
    day: d,
    iso: `${y}-${pad(m)}-${pad(d)}`,
    display: `${pad(d)}/${pad(m)}/${y}`
  };
};

export const getShiftDateObj = (week, dayStr) => {
  if (!week || !week.startDate) return null;
  const dayOffsets = { 'T2': 0, 'T3': 1, 'T4': 2, 'T5': 3, 'T6': 4, 'T7': 5, 'CN': 6 };
  const offset = dayOffsets[dayStr] ?? 0;
  const parts = week.startDate.split('-');
  if (parts.length !== 3) return null;
  const baseDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  baseDate.setDate(baseDate.getDate() + offset);
  const d = String(baseDate.getDate()).padStart(2, '0');
  const m = String(baseDate.getMonth() + 1).padStart(2, '0');
  const y = baseDate.getFullYear();
  return {
    dayOfMonth: d,
    month: m,
    year: y,
    short: `${d}/${m}`,
    full: `${d}/${m}/${y}`,
    iso: `${y}-${m}-${d}`,
    monthKey: `${y}-${m}`
  };
};

export const getShiftDateShort = (week, dayStr) => {
  const obj = getShiftDateObj(week, dayStr);
  return obj ? obj.short : '';
};

export const getShiftDateFull = (week, dayStr) => {
  const obj = getShiftDateObj(week, dayStr);
  return obj ? obj.full : '';
};

export const getWeekDateRangeDisplay = (week) => {
  if (!week || !week.startDate) return '';
  const start = getShiftDateObj(week, 'T2');
  const end = getShiftDateObj(week, 'CN');
  if (!start || !end) return '';
  return `${start.short} – ${end.short}`;
};

export const sortShiftsChronologically = (shifts) => {
  if (!Array.isArray(shifts)) return [];
  const dayOrder = { 'T2': 0, 'T3': 1, 'T4': 2, 'T5': 3, 'T6': 4, 'T7': 5, 'CN': 6 };
  return [...shifts].sort((a, b) => {
    const dayA = dayOrder[(a.day || '').toUpperCase().trim()] ?? 99;
    const dayB = dayOrder[(b.day || '').toUpperCase().trim()] ?? 99;
    if (dayA !== dayB) return dayA - dayB;
    const startA = a.start || '';
    const startB = b.start || '';
    if (startA !== startB) return startA.localeCompare(startB);
    const endA = a.end || '';
    const endB = b.end || '';
    return endA.localeCompare(endB);
  });
};

export const ensureWeekStartDate = (week, index) => {
  if (week.startDate) return;
  const now = new Date();
  const totalWeeks = state.weeks.length || 1;
  const weeksBack = (totalWeeks - 1 - index);
  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() - weeksBack * 7);
  week.startDate = getMondayDate(targetDate);
};

export const getDayClass = (day) => {
  const d = (day || '').toUpperCase().trim();
  switch (d) {
    case 'T2': return 'day-t2';
    case 'T3': return 'day-t3';
    case 'T4': return 'day-t4';
    case 'T5': return 'day-t5';
    case 'T6': return 'day-t6';
    case 'T7': return 'day-t7';
    case 'CN': return 'day-cn';
    default: return 'day-t2';
  }
};

export const escapeHtml = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export const detectShiftType = (startTimeStr, endTimeStr = null) => {
  if (!startTimeStr && !endTimeStr) return 'Tối';

  const parseMins = (str) => {
    if (!str) return null;
    const smart = parseSmartTime(str);
    const timeStr = smart || str;
    const parts = String(timeStr).trim().split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) || 0;
    if (isNaN(h)) return null;
    return h * 60 + m;
  };

  const getTypeForMinute = (mins) => {
    const m = ((mins % 1440) + 1440) % 1440;
    if (m >= 300 && m < 660) return 'Sáng';
    if (m >= 660 && m < 1020) return 'Trưa';
    return 'Tối';
  };

  const sMins = parseMins(startTimeStr);
  const eMins = parseMins(endTimeStr);

  if (sMins === null && eMins !== null) {
    return getTypeForMinute(eMins - 1);
  }
  if (sMins !== null && eMins === null) {
    return getTypeForMinute(sMins);
  }
  if (sMins === null && eMins === null) return 'Tối';

  let totalEnd = eMins;
  if (totalEnd <= sMins) {
    totalEnd += 1440;
  }

  let sang = 0;
  let trua = 0;
  let toi = 0;

  const addInterval = (a, b) => {
    if (a >= b) return;
    sang += Math.max(0, Math.min(b, 660) - Math.max(a, 300));
    trua += Math.max(0, Math.min(b, 1020) - Math.max(a, 660));
    toi += Math.max(0, Math.min(b, 300) - Math.max(a, 0));
    toi += Math.max(0, Math.min(b, 1440) - Math.max(a, 1020));
  };

  if (totalEnd <= 1440) {
    addInterval(sMins, totalEnd);
  } else {
    addInterval(sMins, 1440);
    addInterval(0, totalEnd - 1440);
  }

  if (sang > trua && sang > toi) return 'Sáng';
  if (trua > sang && trua > toi) return 'Trưa';
  if (toi > sang && toi > trua) return 'Tối';

  return getTypeForMinute(eMins - 1);
};

export const syncShiftsTypeConsistency = (weeks = state.weeks) => {
  if (!Array.isArray(weeks)) return false;
  const standardTypes = ['Sáng', 'Trưa', 'Tối'];
  let changed = false;
  weeks.forEach(w => {
    if (Array.isArray(w?.shifts)) {
      w.shifts.forEach(s => {
        if (s && s.start && s.end) {
          const currentType = formatShiftType(s.type);
          if (!currentType || standardTypes.includes(currentType)) {
            const detected = detectShiftType(s.start, s.end);
            if (s.type !== detected) {
              s.type = detected;
              changed = true;
            }
          }
        }
      });
    }
  });
  return changed;
};

export const calculateSmartShiftDefaults = (prefill = null, now = new Date()) => {
  let endHour = now.getHours();
  if (now.getMinutes() >= 30) {
    endHour = (endHour + 1) % 24;
  }
  let endMin = 0;
  const endTotalMins = endHour * 60;
  let defaultEnd = `${String(endHour).padStart(2, '0')}:00`;

  const allPastShifts = [];
  if (Array.isArray(state.weeks)) {
    state.weeks.forEach(w => {
      if (Array.isArray(w.shifts)) {
        w.shifts.forEach(s => {
          if (s && s.start && s.end) {
            allPastShifts.push(s);
          }
        });
      }
    });
  }

  let durationMinutes = 4 * 60;
  let detectedType = '';
  let detectedBreak = 0;

  if (allPastShifts.length > 0) {
    const similarEndShifts = allPastShifts.filter(s => {
      const sEndMins = parseTimeToMinutes(s.end);
      let diff = Math.abs(sEndMins - endTotalMins);
      if (diff > 12 * 60) diff = 24 * 60 - diff;
      return diff <= 90;
    });

    const candidateShifts = similarEndShifts.length > 0 ? similarEndShifts : allPastShifts;

    const durations = candidateShifts.map(s => {
      const sStart = parseTimeToMinutes(s.start);
      let sEnd = parseTimeToMinutes(s.end);
      if (sEnd <= sStart) sEnd += 24 * 60;
      return sEnd - sStart;
    }).filter(d => d > 0 && d <= 16 * 60);

    if (durations.length > 0) {
      durations.sort((a, b) => a - b);
      const rawDur = durations[Math.floor(durations.length / 2)];
      durationMinutes = Math.max(60, Math.round(rawDur / 60) * 60);
    }

    if (similarEndShifts.length > 0) {
      const typeCounts = {};
      similarEndShifts.forEach(s => {
        if (s.type) typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
      });
      const topType = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a])[0];
      if (topType) detectedType = topType;

      const breakCounts = {};
      similarEndShifts.forEach(s => {
        const b = Number(s.breakMinutes) || 0;
        breakCounts[b] = (breakCounts[b] || 0) + 1;
      });
      const topBreak = Object.keys(breakCounts).sort((a, b) => breakCounts[b] - breakCounts[a])[0];
      if (topBreak !== undefined) detectedBreak = Number(topBreak);
    }
  }

  let startTotalMins = (endTotalMins - durationMinutes + 24 * 60) % (24 * 60);
  let startHour = Math.floor(startTotalMins / 60);
  let defaultStart = `${String(startHour).padStart(2, '0')}:00`;

  const defaultDay = prefill?.day || getVietnameseDayOfWeek(now);

  if (prefill) {
    if (prefill.start) defaultStart = prefill.start;
    if (prefill.end) defaultEnd = prefill.end;
    if (prefill.type) {
      detectedType = prefill.type;
    } else if (prefill.start || prefill.end) {
      detectedType = detectShiftType(prefill.start, prefill.end);
    }
  }

  if (!detectedType) {
    detectedType = detectShiftType(defaultStart, defaultEnd);
  }

  return {
    start: defaultStart,
    end: defaultEnd,
    type: detectedType,
    day: defaultDay,
    breakMinutes: detectedBreak,
    note: prefill?.note || ''
  };
};

export const slugify = (text) => {
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .trim();
};
