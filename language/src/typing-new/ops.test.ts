import { parseTyped, WithUnary } from '../parsing/parser-new';
import { GroupedOp, reGroupOps } from './ops';

export const rawSnapshotSerializer: jest.SnapshotSerializerPlugin = {
    test(value) {
        return value && typeof value === 'string';
    },
    print(value, _, __) {
        return value as string;
    },
};
expect.addSnapshotSerializer(rawSnapshotSerializer);

const l = (n: number) => '[({<'[n % 4];
const r = (n: number) => '])}>'[n % 4];

const int = (w: WithUnary) =>
    w.inner.sub.type === 'Int' ? w.inner.sub.contents : null;
const groups = (w: WithUnary | GroupedOp, i: number): any =>
    w.type === 'WithUnary'
        ? int(w)
        : `${w.items[0].op.op}${l(i)}${groups(
              w.left,
              i + 1,
          )} ${w.items.map((n) => groups(n.right, i + 1)).join(' ')}${r(i)}`;

describe('stuff', () => {
    it('ok', () => {
        const parsed = parseTyped(`2 + 3 * 4 * 5 + 1 + 2 ^ 3 & 4`);
        const top = parsed.tops![0].top;
        if (top.type === 'ToplevelExpression') {
            expect(groups(reGroupOps(top.expr), 0)).toMatchInlineSnapshot(
                `&[+(2 *{3 4 5} 1 ^{2 3}) 4]`,
            );
        }
    });
});
