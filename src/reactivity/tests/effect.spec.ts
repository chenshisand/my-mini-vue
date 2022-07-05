
import { effect } from '../effect';
import { reactive } from '../reactive'
describe ("effect", () => {
    it ('happy path', () => {
        const user = reactive ({
            age : 10
        })
        
        let nextAge;

        effect(() => {
            nextAge = user.age + 1
        })
        expect(nextAge).toBe(11)
        user.age++;
        expect(nextAge).toBe(12)
    })
    it ('should return runner when call effect', () => {
        // effect(fn) -> function(runner) -> fn -> return
        // 执行effect 可以拿到内部fn的返回值
        let foo = 10 
        const runner = effect(() =>{
            foo++
            return 'foo'
        })

        expect(foo).toBe(11)
        const r = runner()
        expect(foo).toBe(12)
        expect(r).toBe('foo')
    })
    it('scheduler', () => {
        let dummy;
        let run:any;
        const scheduler = jest.fn(() => {
            run = runner
        })
        const obj = reactive({ foo : 1 })
        const runner = effect(() => {
            dummy = obj.foo
        },{ scheduler })
        // scheduler没有调用，执行effect
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)

        obj.foo++
        // 触发依赖时没有调用fn，调用的scheduler
        expect(scheduler).toHaveBeenCalledTimes(1)
        expect(dummy).toBe(1)

        run()
        // 执行run,调用fn
        expect(dummy).toBe(2)
    })
})