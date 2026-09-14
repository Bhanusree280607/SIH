from fastapi import APIRouter
from app.schemas import AIQuestionRequest, AIAnswerResponse
from app.services.ai_service import get_ai_answer

router = APIRouter(prefix="/ai", tags=["AI Agricultural Voice Assistant"])

@router.post("/ask", response_model=AIAnswerResponse)
def ask_ai_assistant(req: AIQuestionRequest):
    result = get_ai_answer(
        question=req.question,
        language=req.language,
        context=req.farmer_context
    )
    
    return AIAnswerResponse(
        answer=result.get("answer", ""),
        telugu_answer=result.get("answer", "") if req.language == "te" else None,
        language=result.get("language", req.language),
        voice_friendly_text=result.get("voice_friendly_text", result.get("answer", "")[:120]),
        suggestions=result.get("suggestions", []),
        grounded_source=result.get("grounded_source", "RythuMithra Agricultural Core")
    )
