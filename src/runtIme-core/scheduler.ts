const queue: any = [];
let p = Promise.resolve();
let isFlushPenging = false;
export function queueJobs(job) {
  if (!queue.includes(job)) {
    queue.push(job);
  }
  queueFlush();
}
export function nextTick(fn) {
  return fn ? p.then(fn) : p;
}
function queueFlush() {
  if (isFlushPenging) return;
  isFlushPenging = true;
  nextTick(flushJobs);
}
function flushJobs() {
  isFlushPenging = false;
  let job;
  console.log(job, "job");
  while ((job = queue.shift())) {
    console.log(job, "job2");

    job && job();
  }
}
