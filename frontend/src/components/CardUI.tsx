import React, { useState } from 'react';
function CardUI()
{

 const [message,setMessage] = useState('');
 const [searchResults,setResults] = useState('');
 const [cardList,setCardList] = useState('');
 const [search,setSearchValue] = React.useState('');
 const [card,setCardNameValue] = React.useState('');

 function addCard(e:any) : void
 {
 e.preventDefault();
 alert('addCard() ' + card);
 };
 function searchCard(e:any) : void
 {
 e.preventDefault();

 alert('searchCard() ' + search);
 };
 function handleSearchTextChange( e: any ) : void
 {
 setSearchValue( e.target.value );
 }
 function handleCardTextChange( e: any ) : void
 {
 setCardNameValue( e.target.value );
 }
 return(
 <div id="cardUIDiv">
 <br />
 Search: <input type="text" id="searchText" placeholder="Card To
Search For"
 onChange={handleSearchTextChange} />
 <button type="button" id="searchCardButton" className="buttons"
 onClick={searchCard}> Search Card</button><br />
 <span id="cardSearchResult">{searchResults}</span>
 <p id="cardList">{cardList}</p><br /><br />
 Add: <input type="text" id="cardText" placeholder="Card To Add"
 onChange={handleCardTextChange} />
 <button type="button" id="addCardButton" className="buttons"
 onClick={addCard}> Add Card </button><br />
 <span id="cardAddResult">{message}</span>
 </div>
 );
}
export default CardUI;