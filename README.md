# Decentralized-Voting-Application
The project is inspired by an real usecase to develop an Decentralized end-to-end Voting Application to Elect World Bank President with Upvote and Downvote feature using Remix, Solidity, Truffle, Ganache,Web3.js
 
## 1. Problem Statement: 
Each country that belongs to the World Bank has a certain amount of vote share in electing the president of the World Bank. Voting share is based on the share a given country holds in the bank which is in turn based on the economic size of the country. Most of the major players in voting are countries like USA,Japan, Germany. But most countries form country groupings that "share" a director. For example, the               executive director from Austria, represents Austria, Belarus, Belgium and Turkey. When he casts his vote, he votes the collected voting share of those countries, and there is no provision for splitting up that share. The nomination process for world bank president selects three official candidates from three different countries. 
Firstly, candidates are interviewed by Bank’s executive board directors representing different countries
After the interview, directors and bank employees can cast their vote with upvote and downvote feature.
### ● Upvote: 
1. Each director can give as many upvotes as he wants to multiple candidates. The weight for each director’s upvote is 10. 
2. Each bank employee can give as many votes as he wants to multiple candidates. The weight for each bank worker’s vote is 1.
### ● DownVote: 
1. Each director and bank employee can give as many downvotes as he wants to multiple candidates. 
2. Each down vote will decrement the total vote count by 1. 
After the voting is done, the winner will be declared which is the candidate who gets the maximum number of votes.

## 2. Planning and Design: 

### 2.1 Use Case Diagram: 


 
