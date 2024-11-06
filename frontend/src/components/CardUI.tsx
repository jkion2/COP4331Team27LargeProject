function CardUI()
{

 function addCard(event:any) : void
 {
 event.preventDefault();
 alert('addCard()');
 };
 function searchCard(event:any) : void
 {
 event.preventDefault();
 
 alert('searchCard');
 };
 return(
 <div id="accessUIDiv">
 <br />
 <input type="text" id="searchText" placeholder="Card To Search For" />
 <button type="button" id="searchCardButton" className="buttons"
 onClick={searchCard}> Search Card </button><br />
 <span id="cardSearchResult"></span>
 <p id="cardList"></p><br /><br />
 <input type="text" id="cardText" placeholder="Card To Add" />
 <button type="button" id="addCardButton" className="buttons"
 onClick={addCard}> Add Card </button><br />
 <span id="cardAddResult"></span>
 </div>
 );
}
export default CardUI;