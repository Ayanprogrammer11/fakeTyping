function Stats({ stats }) {
  return (
    <div className="stats bg-primary text-primary-content w-fit">
      <div className="stat">
        <div className="stat-title text-3xl font-extrabold">Pings</div>
        <div className="stat-value text-1xl">{stats.pings}</div>
      </div>
      <div className="stat">
        <div className="stat-title text-3xl font-extrabold">Duration</div>
        <div className="stat-value text-1xl">{stats.duration}</div>
      </div>
    </div>
  );
}

export default Stats;
