(function () {
  function dateKey(date) {
    return String(date || "").slice(0, 10);
  }

  function previousDate(key, daysBack = 1) {
    const date = new Date(`${key}T12:00:00`);
    date.setDate(date.getDate() - daysBack);
    return date.toISOString().slice(0, 10);
  }

  function childRecord(history, date, childId) {
    return history?.[dateKey(date)]?.[childId] || {};
  }

  function missionWasDone(record, missionId) {
    if (!record) return false;
    if (record.done?.[missionId]) return true;
    return Array.isArray(record.log) && record.log.some(item =>
      item.taskId === missionId ||
      item.missionId === missionId ||
      item.cardMissionId === missionId ||
      item.taskTitleAtTime === "Pati užmigau be kitų" ||
      item.title === "Pati užmigau be kitų"
    );
  }

  function totalPreviousSuccesses(history, childId, missionId, date) {
    return Object.keys(history || {})
      .filter(key => key < dateKey(date))
      .filter(key => missionWasDone(childRecord(history, key, childId), missionId))
      .length;
  }

  function successStreak(history, childId, missionId, date) {
    let streak = 0;
    let key = dateKey(date);
    while (missionWasDone(childRecord(history, key, childId), missionId)) {
      streak += 1;
      key = previousDate(key);
    }
    return streak;
  }

  function daysSincePreviousSuccess(history, childId, missionId, date) {
    for (let daysBack = 1; daysBack <= 90; daysBack += 1) {
      const key = previousDate(dateKey(date), daysBack);
      if (missionWasDone(childRecord(history, key, childId), missionId)) return daysBack;
    }
    return Infinity;
  }

  function scenarioById(card, scenarioId) {
    return (card?.dynamicScenarios || []).find(item => item.scenarioId === scenarioId) ||
      (card?.dynamicScenarios || []).find(item => item.scenarioId === "DEFAULT") ||
      null;
  }

  function selectGrowthScenario({ childId, missionId, date, history, card }) {
    const key = dateKey(date);
    const todayRecord = childRecord(history, key, childId);
    const doneToday = missionWasDone(todayRecord, missionId);
    const previousSuccesses = totalPreviousSuccesses(history, childId, missionId, key);
    const streak = successStreak(history, childId, missionId, key);
    const gap = daysSincePreviousSuccess(history, childId, missionId, key);
    const yesterday = childRecord(history, previousDate(key), childId);
    const failedYesterday = yesterday?.done && !missionWasDone(yesterday, missionId);

    let scenarioId = "DEFAULT";
    if (doneToday && previousSuccesses === 0) scenarioId = "FIRST_TIME";
    else if (doneToday && failedYesterday) scenarioId = "AFTER_FAILURE";
    else if (doneToday && gap >= 10 && Number.isFinite(gap)) scenarioId = "LONG_BREAK";
    else if (streak >= 30) scenarioId = "SUCCESS_STREAK_30";
    else if (streak >= 14) scenarioId = "SUCCESS_STREAK_14";
    else if (streak >= 7) scenarioId = "SUCCESS_STREAK_7";
    else if (streak >= 3) scenarioId = "SUCCESS_STREAK_3";
    else if (doneToday && previousSuccesses >= 5) scenarioId = "BIG_PROGRESS";
    else if (doneToday) scenarioId = "SMALL_PROGRESS";

    return scenarioById(card, scenarioId);
  }

  window.KrabukaiSelectGrowthScenario = selectGrowthScenario;
})();
