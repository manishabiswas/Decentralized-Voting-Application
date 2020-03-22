pragma solidity^0.5.2;

contract WorldBankElection{
    struct candidate{
       uint age;
       int256 voteCount;
       int256 totalCandidate;
    }
    struct Voter{
        uint weight;
        uint age;
        int256 vote;
        bool voted;
        bool registered;
        VoterType _type;
    }
    candidate[] candidates;
    address chairperson;
    mapping(address => Voter) Voters;
    enum Phase {Init,Regs, Vote, Done}  
    Phase public state = Phase.Init; 
    
    enum VoterType {director,employee}
    
     modifier validPhase(Phase reqPhase) 
    { require(state == reqPhase); 
      _; 
    } 
    
    modifier onlyChair() 
     {require(msg.sender == chairperson);
      _;
     }
     
    modifier registeredVoter(){
         require(Voters[msg.sender].registered == true);
         _;
    }
    
    modifier checkIfGreaterThan18(uint age){
        require(age >= 18, 'Age should be at least 18.');
        _;
    }
    
    modifier CheckIfAlreadyVoted(){
        require(Voters[msg.sender].voted == false);
        _;
    }

    
    constructor(uint maxCandidates) public{
        chairperson = msg.sender;
        Voters[chairperson]._type = VoterType.director;
        Voters[chairperson].weight = 10;
        Voters[chairperson].voted = false;
        state = Phase.Regs;
        candidates.length = maxCandidates;
    }
        
     function changeState(Phase x) onlyChair public {
        
        require (x > state );
       
        state = x;
     
    }
    
    function registerCandidates(uint _id, uint age) onlyChair checkIfGreaterThan18(age) public {
        
        candidates[_id].age = age;
        candidates[_id].voteCount = 0;
        //candidates[_id].totalCandidate =candidates[_id].totalCandidate + 1;
        
    }

    function register(address voter , VoterType _type) public onlyChair validPhase(Phase.Regs){
       
        require (! Voters[voter].voted);
        Voters[voter]._type == _type;
        if( _type == VoterType.director)
        {
        Voters[voter].weight = 10;
        }
        else
        {
         Voters[voter].weight = 1;   
        }
        Voters[voter].voted = false;
    }
    
    
     function Downvote(uint _id) public validPhase(Phase.Vote)
    {
         Voter memory sender = Voters[msg.sender];
        require (!sender.voted); 
        require (_id < (candidates.length));
        sender.voted = true;
        sender.vote = int256(_id);
        candidates[_id].voteCount -= 1;
    }
    
    function vote(uint _id) validPhase(Phase.Vote) public
    {
       
       Voter memory sender = Voters[msg.sender];
       require (!sender.voted); 
       require (_id < (candidates.length));
       sender.voted = true;
       (sender.vote) = int256(_id);
       (candidates[_id].voteCount) += int256(Voters[msg.sender].weight);
    }
    
    function reqWinner() validPhase(Phase.Done) public view returns (uint winningId ) {
        int256 winningVoteCount = 0;
        for (uint8 i = 0; i < candidates.length; i++) 
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningId = i;
            }
       assert(winningVoteCount>=1);
    }
    
     function voteCount(uint _id) public view returns(int256)
    {
        int256 count = candidates[_id].voteCount;
        return count;
    }
}
