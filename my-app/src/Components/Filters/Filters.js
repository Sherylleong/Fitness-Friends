

function filters(){
	let groups = ["a","b"];
	function handleFilters(){}
	return (
		<form>
		  <select
			name="filterIntensity"
			onChange={(e) => {
				handleFilters(e);
			}}
		  >
		  </select>
		  <label>Date</label>
		  <label>Start Date</label>
		  <input type="date"/>
		  <label>End Date</label>
		  <input type="date"/>

		  <select
			name="filterCategory"
			onChange={(e) => {
				handleFilters(e);
			}}
		  >
			<option value="none">Category</option>
			<option value="Walking"> Running</option>
			<option value="Jogging"> Running</option>
			<option value="Running"> Running</option>
			<option value="Climbing"> Running</option>
			<option value="Biking"> Running</option>
			<option value="Sports"> Running</option>
			<option value="Other"> Running</option>
		  </select>

		  <select
			name="filterGroup"
			onChange={(e) => {
				handleFilters(e);
			}}
		  >
			{groups.map(group => {
           		return (
             		<option value={group}> {group} </option>
           		)
         	})}
		  </select>
		</form>
	  );
}