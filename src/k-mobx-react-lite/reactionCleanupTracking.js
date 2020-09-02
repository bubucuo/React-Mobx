export function createTrackingData(reaction) {
  const trackingData = {
    cleanAt: Date.now() + CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS,
    reaction
  };
  return trackingData;
}

export function cleanUncommittedReactions() {
  reactionCleanupHandle = undefined;

  // 循环遍历所有的漏掉的反应式
  const now = Date.now();
  uncommittedReactionRefs.forEach(ref => {
    const tracking = ref.current;
    if (tracking) {
      if (now >= tracking.cleanAt) {
        // 该清理这个漏掉的反应式了
        tracking.reaction.dispose();
        ref.current = null;
        uncommittedReactionRefs.delete(ref);
      }
    }
  });
  if (uncommittedReactionRefs.size > 0) {
    // 刚刚完成一轮的cleanup，但是仍然有些漏掉的
    ensureCleanupTimerRunning();
  }
}

const uncommittedReactionRefs = new Set();
export const CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS = 10_000;

// 最近的‘未提交的反应式’清理时间函数
let reactionCleanupHandle;

function ensureCleanupTimerRunning() {
  if (reactionCleanupHandle === undefined) {
    reactionCleanupHandle = setTimeout(
      cleanUncommittedReactions,
      CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS
    );
  }
}

export function scheduleCleanupOfReactionIfLeaked(ref) {
  uncommittedReactionRefs.add(ref);
  ensureCleanupTimerRunning();
}

export function recordReactionAsCommitted(reactionRef) {
  uncommittedReactionRefs.delete(reactionRef);
}
