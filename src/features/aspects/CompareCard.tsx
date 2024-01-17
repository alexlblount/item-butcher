import classnames from 'classnames/bind';
// aliased
import { aspects } from '@features/imageParsing/extractAspects';
import { getTypeName, getPowerDisplay } from '@features/vault/itemHelpers';
import type { Item } from '@features/imageParsing/transformText';
import Thumbnail from '@features/layout/Thumbnail';
// relative
import { getAspectStrength, getStrengthMultiplier } from './rankStrength';
import type { AspectRanking } from './rankStrength';
import styles from './CompareCard.module.css';

const cx = classnames.bind(styles);

function formatAspectValue(value: number | string): string {
  if (typeof value === 'string') return value;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 5,
  }).format(value);
}

interface AspectTextProps {
  rankings: AspectRanking;
  item: Item;
}

function AspectText({ item, rankings }: AspectTextProps) {
  const { aspect } = item;
  if (!aspect) return null;

  if (!item.aspect?.type) return null;
  const aspectType = item.aspect.type;

  const aspectData = aspects.find((a) => a.aspect === aspectType);
  if (!aspectData) return null;

  const ranking = rankings[aspectType];
  if (!ranking) return null;
  const { rankings: ranks, maxValues } = ranking;

  const baseValues = getAspectStrength(item);
  if (!baseValues) return null;

  // split the aspectData.text by '#' and return as a series of spans
  // replace the '#' with the value from values
  // add the ranking after the number in a span
  // add the "max" class to the strength's span if it's the highest value

  let valueIndex = 0;
  const aspectNodes = aspectData.text.split('#').map((text, index) => {
    if (index === 0 || valueIndex >= baseValues.length) return <span key={index}>{text}</span>;

    const value = baseValues[valueIndex];
    const rankGroup = ranks[valueIndex];

    // console.log({ value, rankGroup, ranks, itemId: item.id });
    const rank = rankGroup.findIndex((x) => x.itemId === item.id) + 1;

    valueIndex += 1;
    return (
      <span key={index}>
        <span className={styles.value}>{formatAspectValue(value)}</span>
        {' ('}
        <span className={cx('rank', rank === 1 ? 'max' : '')}>{`#${rank}`}</span>
        {')'}
        {text}
      </span>
    );
  });

  return <div className={cx('aspect', 'text')}>{aspectNodes}</div>;
}

interface CompareCardProps {
  item: Item;
  rankings: AspectRanking;
}

export default function CompareCard({ item, rankings }: CompareCardProps) {
  const { name, aspect } = item;
  const typeName = getTypeName(item);
  const powerDisplay = getPowerDisplay(item);
  const strengthMultiplier = getStrengthMultiplier(item);

  return (
    <div className={styles.card}>
      <div className={cx('text', 'title', 'clearfix')}>
        <Thumbnail item={item} />
        {name}
      </div>
      <div className={cx('text', 'itemType')}>{typeName}</div>
      <div className={cx('text', 'power')}>{powerDisplay}</div>
      <div className={cx('text', { extractable: !aspect?.imprinted })}>{aspect?.imprinted ? 'Imprinted' : 'Extractable'}</div>
      <div className={cx('text', 'multiplier')}>{`Effect Multiplier: ${strengthMultiplier}x`}</div>
      <div className={cx('text', 'aspect')}>Base Effect:</div>
      <AspectText item={item} rankings={rankings} />
    </div>
  );
}
