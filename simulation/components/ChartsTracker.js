
// Updates every minute (60,000 ms)
const CHARTS_UPDATE_TIMER_INTERVAL = 60000;

function ChartsTracker() {}

ChartsTracker.prototype.Schema = "<a:component type='system'/><empty/>";

ChartsTracker.prototype.GetChartData = function()
{
	return this.chartData;
};
	
ChartsTracker.prototype.Init = function()
{
	var cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	this.updateTimer = cmpTimer.SetInterval(this.entity, IID_ChartsTracker, "updateData", 0, CHARTS_UPDATE_TIMER_INTERVAL, {});
	this.timeStamp = -1;
	this.chartData = {};
};

ChartsTracker.prototype.updateData = function()
{
	// Get player + range + stats manager
	var cmpPlayer = Engine.QueryInterface(this.entity, IID_Player);
	var id = cmpPlayer.GetPlayerID();
	var mapExplored = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager).GetPercentMapExplored(cmpPlayer.GetPlayerID());
	var mapControlled = Engine.QueryInterface(SYSTEM_ENTITY, IID_TerritoryManager).GetTerritoryPercentage(cmpPlayer.GetPlayerID());
	var resourceCount = cmpPlayer.GetResourceCounts();
	var statistics = Engine.QueryInterface(this.entity, IID_StatisticsTracker).GetStatistics();

	++this.timeStamp;

	this.chartData[this.timeStamp.toString()] = {
		'mapControl': mapControlled,
		'explored':  mapExplored,
		'food':  resourceCount.food,
		'wood':  resourceCount.wood,
		'stone': resourceCount.stone,
		'metal': resourceCount.metal,
		'units': cmpPlayer.GetPopulationCount(),
		'buildings': statistics.buildingsConstructed.total - statistics.buildingsLost.total
	};

	// warn ("CHARTS: updateData: p: " + id + "/" +  this.timeStamp + " : " + uneval(this.chartData[this.timeStamp + ""]) + "\n");
};

Engine.RegisterComponentType(IID_ChartsTracker, "ChartsTracker", ChartsTracker);
