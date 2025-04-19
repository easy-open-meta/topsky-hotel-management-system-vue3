import { SnowflakeId } from '@akashrajpurohit/snowflake-id';

const getLocalTime = () => new Date().getTime();
const START_STAMP = getLocalTime();

const snowflake = SnowflakeId({
  workerId: 1,
  epoch: START_STAMP,
});

function generateSnowflakeId(options = {}) {
  const { prefix = '', separator = '' } = options;
  const id = snowflake.generate();

  return prefix + (separator ? separator : '') + id;
}

export default generateSnowflakeId;
